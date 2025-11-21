import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

interface EmailRequest {
  tenantId: string;
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - No user session" },
        { status: 401 }
      );
    }

    const body: EmailRequest = await req.json();
    const { tenantId, to, subject, body: emailBody, from } = body;

    if (!tenantId || !to || !subject || !emailBody) {
      return NextResponse.json(
        { error: "Missing required fields: tenantId, to, subject, body" },
        { status: 400 }
      );
    }

    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id, role")
      .eq("user_id", user.id)
      .eq("tenant_id", tenantId)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden - User not member of this tenant" },
        { status: 403 }
      );
    }

    const { data: tenant } = await supabase
      .from("tenants")
      .select("name, owner_id")
      .eq("id", tenantId)
      .single();

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    const fromEmail = from || process.env.SES_FROM_EMAIL || "noreply@blox.onecs.net";

    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    const result = await sesClient.send(command);

    await supabase.from("tool_usage_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      tool_name: "email_send",
      tool_provider: "aws_ses",
      input_data: {
        to,
        subject,
        from: fromEmail,
      },
      output_data: {
        messageId: result.MessageId,
        success: true,
      },
      status: "success",
    });

    return NextResponse.json({
      success: true,
      messageId: result.MessageId,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending email:", error);

    try {
      const supabase = await createSupabaseServer();
      const { data: { user } } = await supabase.auth.getUser();
      const body = await req.json().catch(() => ({}));

      if (user?.id && body.tenantId) {
        await supabase.from("tool_usage_logs").insert({
          tenant_id: body.tenantId,
          user_id: user.id,
          tool_name: "email_send",
          tool_provider: "aws_ses",
          input_data: body,
          output_data: {
            error: error.message,
          },
          status: "error",
        });
      }
    } catch (logError) {
      console.error("Error logging tool usage:", logError);
    }

    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
