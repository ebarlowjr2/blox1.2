import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export const runtime = "nodejs";

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
  actorUserId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: EmailRequest = await req.json();
    const { tenantId, to, subject, body: emailBody, from, actorUserId } = body;

    if (!tenantId || !to || !subject || !emailBody) {
      return NextResponse.json(
        { error: "Missing required fields: tenantId, to, subject, body" },
        { status: 400 }
      );
    }

    const gatewaySecret = req.headers.get("x-gateway-secret");
    const isServerToServer = gatewaySecret === process.env.TOOL_GATEWAY_SECRET && gatewaySecret;

    let userId: string;
    let supabase;

    if (isServerToServer) {
      if (!actorUserId) {
        return NextResponse.json(
          { error: "actorUserId required for server-to-server calls" },
          { status: 400 }
        );
      }

      supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      userId = actorUserId;

      const { data: membership } = await supabase
        .from("tenant_members")
        .select("tenant_id")
        .eq("user_id", actorUserId)
        .eq("tenant_id", tenantId)
        .single();

      if (!membership) {
        return NextResponse.json(
          { error: "Forbidden - Actor user not member of this tenant" },
          { status: 403 }
        );
      }
    } else {
      supabase = await createSupabaseServer();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        return NextResponse.json(
          { error: "Unauthorized - No user session" },
          { status: 401 }
        );
      }

      userId = user.id;

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
      user_id: userId,
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

    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
