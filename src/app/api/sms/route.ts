import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

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

    console.log('SMS received - logged but not stored:', { From, Body, To, MessageSid });
    
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
      
      await twilioClient.messages.create({
        body: replyMessage,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: From
      });
      
      console.log('Auto-reply sent successfully to:', From);
      
      return NextResponse.json({ 
        success: true, 
        message: 'SMS received, logged, and auto-reply sent (no database storage)',
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
    return NextResponse.json({ 
      success: true, 
      messages: [],
      message: 'SMS message storage disabled - no database configured'
    });
  } catch (error) {
    console.error('SMS fetch error:', error);
    return NextResponse.json({ 
      success: true,
      messages: [],
      message: 'SMS message storage disabled - no database configured'
    });
  }
}
