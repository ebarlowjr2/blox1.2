import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { logToolInvocation } from '@/lib/supabase-admin';

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

interface SmsSendRequest {
  tenantId: string;
  agentName: string;
  to: string;
  message: string;
  runId?: string;
}

interface SmsSendResponse {
  success: boolean;
  messageSid?: string;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    toolKey: string;
    to: string;
    messagePreview: string;
    agentName: string;
  };
  invocationId?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SmsSendResponse>> {
  try {
    const body: SmsSendRequest = await request.json();
    const { tenantId, agentName, to, message, runId } = body;

    // Validate required fields
    if (!tenantId || !agentName || !to || !message) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields: tenantId, agentName, to, message',
        },
      }, { status: 400 });
    }

    // Validate phone number format (basic check)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanedPhone = to.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PHONE',
          message: 'Invalid phone number format. Please use E.164 format (e.g., +1234567890)',
        },
      }, { status: 400 });
    }

    // Check if Twilio is configured
    if (!twilioClient) {
      console.error('Twilio credentials not configured');
      
      // Log the failed attempt
      await logToolInvocation({
        tenant_id: tenantId,
        agent_name: agentName,
        tool_key: 'sms',
        payload: { to: cleanedPhone, messageLength: message.length },
        result: { status: 'error', errorCode: 'TWILIO_NOT_CONFIGURED', errorMessage: 'SMS service not configured' },
        run_id: runId,
      });

      return NextResponse.json({
        success: false,
        error: {
          code: 'TWILIO_NOT_CONFIGURED',
          message: 'SMS service is not configured. Please contact support.',
        },
      }, { status: 503 });
    }

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromNumber) {
      console.error('Twilio phone number not configured');
      
      await logToolInvocation({
        tenant_id: tenantId,
        agent_name: agentName,
        tool_key: 'sms',
        payload: { to: cleanedPhone, messageLength: message.length },
        result: { status: 'error', errorCode: 'TWILIO_PHONE_NOT_SET', errorMessage: 'SMS from number not configured' },
        run_id: runId,
      });

      return NextResponse.json({
        success: false,
        error: {
          code: 'TWILIO_PHONE_NOT_SET',
          message: 'SMS service is not fully configured. Please contact support.',
        },
      }, { status: 503 });
    }

    try {
      // Send SMS via Twilio
      const twilioMessage = await twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: cleanedPhone,
      });

      const messageSid = twilioMessage.sid;

      // Log successful invocation
      const logResult = await logToolInvocation({
        tenant_id: tenantId,
        agent_name: agentName,
        tool_key: 'sms',
        payload: { to: cleanedPhone, messageLength: message.length },
        result: { status: 'sent', messageSid },
        run_id: runId,
      });

      // Create a preview of the message (first 50 chars)
      const messagePreview = message.length > 50 ? message.substring(0, 50) + '...' : message;

      return NextResponse.json({
        success: true,
        messageSid,
        meta: {
          toolKey: 'sms',
          to: cleanedPhone,
          messagePreview,
          agentName,
        },
        invocationId: logResult.id,
      });

    } catch (twilioError) {
      console.error('Twilio send error:', twilioError);
      
      const errorMessage = twilioError instanceof Error ? twilioError.message : 'Unknown Twilio error';
      const errorCode = (twilioError as { code?: string })?.code || 'TWILIO_SEND_FAILED';

      // Log the failed attempt
      await logToolInvocation({
        tenant_id: tenantId,
        agent_name: agentName,
        tool_key: 'sms',
        payload: { to: cleanedPhone, messageLength: message.length },
        result: { status: 'error', errorCode, errorMessage },
        run_id: runId,
      });

      return NextResponse.json({
        success: false,
        error: {
          code: String(errorCode),
          message: 'Failed to send SMS. Please try again later.',
        },
      }, { status: 500 });
    }

  } catch (error) {
    console.error('SMS tool gateway error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while processing the SMS request.',
      },
    }, { status: 500 });
  }
}
