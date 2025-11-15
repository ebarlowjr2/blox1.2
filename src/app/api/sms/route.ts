import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { createSupabaseServer } from '@/lib/supabase-server';
import { logActivity } from '@/lib/api-middleware';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received SMS webhook:', body);
    
    const { From, Body, To, MessageSid } = body;
    
    if (!From || !Body || !To) {
      return NextResponse.json({ error: 'Missing required SMS fields' }, { status: 400 });
    }

    const supabase = await createSupabaseServer();

    const { data: channel } = await supabase
      .from("inbound_channels")
      .select("tenant_id")
      .eq("kind", "sms")
      .eq("address", To)
      .single();

    if (!channel) {
      console.log('No tenant found for SMS number:', To);
      return NextResponse.json({ 
        success: false, 
        message: 'No tenant configured for this number',
        received_data: { From, Body, To, MessageSid }
      }, { status: 404 });
    }

    const tenantId = channel.tenant_id;

    const { data: ceoAgent } = await supabase
      .from("agents")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("kind", "CEO")
      .single();

    await supabase.from("messages").insert({
      tenant_id: tenantId,
      agent_id: ceoAgent?.id || null,
      channel: "sms",
      direction: "inbound",
      from_address: From,
      to_address: To,
      content: Body,
      metadata: { message_sid: MessageSid },
    });

    if (!twilioClient) {
      console.log('Twilio not configured - SMS logged only');
      return NextResponse.json({ 
        success: true, 
        message: 'SMS received and logged (no auto-reply - Twilio not configured)',
        received_data: { From, Body, To, MessageSid },
        reply_sent: false
      });
    }

    try {
      const replyMessage = `Hi! Thanks for contacting BLOX. Your message has been received and will be reviewed by our team. This is an automated response from our AI system.`;
      
      const sentMessage = await twilioClient.messages.create({
        body: replyMessage,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: From
      });

      await supabase.from("messages").insert({
        tenant_id: tenantId,
        agent_id: ceoAgent?.id || null,
        channel: "sms",
        direction: "outbound",
        from_address: To,
        to_address: From,
        content: replyMessage,
        metadata: { message_sid: sentMessage.sid },
      });

      await logActivity(tenantId, "message_sent", {
        agentId: ceoAgent?.id,
        entityType: "message",
        metadata: { channel: "sms", from: From },
      });
      
      console.log('Auto-reply sent successfully to:', From);
      
      return NextResponse.json({ 
        success: true, 
        message: 'SMS received, logged, and auto-reply sent',
        received_data: { From, Body, To, MessageSid },
        reply_sent: true
      });
    } catch (replyError) {
      console.error('Failed to send auto-reply:', replyError);
      return NextResponse.json({ 
        success: true, 
        message: 'SMS received and logged (auto-reply failed)',
        received_data: { From, Body, To, MessageSid },
        reply_sent: false,
        reply_error: replyError instanceof Error ? replyError.message : 'Unknown reply error'
      });
    }
  } catch (error) {
    console.error('SMS webhook error:', error);
    return NextResponse.json({ 
      error: 'Failed to process SMS',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ 
        error: 'tenantId is required'
      }, { status: 400 });
    }

    const supabase = await createSupabaseServer();

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("channel", "sms")
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ 
      success: true, 
      messages: messages || []
    });
  } catch (error) {
    console.error('SMS fetch error:', error);
    return NextResponse.json({ 
      success: true,
      messages: []
    });
  }
}
