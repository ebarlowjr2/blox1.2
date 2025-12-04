import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { logToolInvocation } from '@/lib/supabase-admin';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface EmailSendRequest {
  tenantId: string;
  agentName: string;
  to: string;
  subject: string;
  body: string;
  runId?: string;
}

interface EmailSendResponse {
  success: boolean;
  messageId?: string;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    toolKey: string;
    to: string;
    subject: string;
    agentName: string;
  };
  invocationId?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<EmailSendResponse>> {
  try {
    const body: EmailSendRequest = await request.json();
    const { tenantId, agentName, to, subject, body: emailBody, runId } = body;

    // Validate required fields
    if (!tenantId || !agentName || !to || !subject || !emailBody) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields: tenantId, agentName, to, subject, body',
        },
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Invalid email address format',
        },
      }, { status: 400 });
    }

    // Check if SES is configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS SES credentials not configured');
      
      // Log the failed attempt
      await logToolInvocation({
        tenant_id: tenantId,
        agent_name: agentName,
        tool_key: 'email',
        payload: { to, subject, bodyLength: emailBody.length },
        result: { status: 'error', errorCode: 'SES_NOT_CONFIGURED', errorMessage: 'Email service not configured' },
        run_id: runId,
      });

      return NextResponse.json({
        success: false,
        error: {
          code: 'SES_NOT_CONFIGURED',
          message: 'Email service is not configured. Please contact support.',
        },
      }, { status: 503 });
    }

    const fromEmail = process.env.SES_FROM_EMAIL || 'blox@barlowholdings.io';

    try {
      // Send email via SES
      const command = new SendEmailCommand({
        Source: fromEmail,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: emailBody,
              Charset: 'UTF-8',
            },
            Html: {
              Data: `<html><body><p>${emailBody.replace(/\n/g, '<br>')}</p></body></html>`,
              Charset: 'UTF-8',
            },
          },
        },
      });

      const response = await sesClient.send(command);
      const messageId = response.MessageId;

      // Log successful invocation
      const logResult = await logToolInvocation({
        tenant_id: tenantId,
        agent_name: agentName,
        tool_key: 'email',
        payload: { to, subject, bodyLength: emailBody.length },
        result: { status: 'sent', messageId },
        run_id: runId,
      });

      return NextResponse.json({
        success: true,
        messageId,
        meta: {
          toolKey: 'email',
          to,
          subject,
          agentName,
        },
        invocationId: logResult.id,
      });

    } catch (sesError) {
      console.error('SES send error:', sesError);
      
      const errorMessage = sesError instanceof Error ? sesError.message : 'Unknown SES error';
      const errorCode = (sesError as { name?: string })?.name || 'SES_SEND_FAILED';

      // Log the failed attempt
      await logToolInvocation({
        tenant_id: tenantId,
        agent_name: agentName,
        tool_key: 'email',
        payload: { to, subject, bodyLength: emailBody.length },
        result: { status: 'error', errorCode, errorMessage },
        run_id: runId,
      });

      return NextResponse.json({
        success: false,
        error: {
          code: errorCode,
          message: 'Failed to send email. Please try again later.',
        },
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Email tool gateway error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while processing the email request.',
      },
    }, { status: 500 });
  }
}
