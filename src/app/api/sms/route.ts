import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received SMS webhook:', body);
    
    const { From, Body, To, MessageSid } = body;
    
    if (!From || !Body || !To) {
      return NextResponse.json({ error: 'Missing required SMS fields' }, { status: 400 });
    }

    try {
      const { data, error } = await supabase
        .from('sms_messages')
        .insert({
          from_number: From,
          to_number: To,
          message: Body,
          message_sid: MessageSid,
          received_at: new Date().toISOString(),
          processed: true
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        if (error.code === '42P01') {
          console.log('SMS table does not exist - message logged but not stored:', { From, Body, To, MessageSid });
          
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
              message: 'SMS received, logged, and auto-reply sent (database table pending creation)',
              warning: 'SMS messages table needs to be created in Supabase',
              received_data: { From, Body, To, MessageSid },
              reply_sent: true
            });
          } catch (replyError) {
            console.error('Failed to send auto-reply:', replyError);
            return NextResponse.json({ 
              success: true, 
              message: 'SMS received and logged (database table pending creation, auto-reply failed)',
              warning: 'SMS messages table needs to be created in Supabase',
              received_data: { From, Body, To, MessageSid },
              reply_sent: false,
              reply_error: replyError instanceof Error ? replyError.message : 'Unknown reply error'
            });
          }
        }
        throw error;
      }

      console.log('SMS message stored:', data);
      
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
          message: 'SMS received, stored, and auto-reply sent',
          id: data.id,
          reply_sent: true
        });
      } catch (replyError) {
        console.error('Failed to send auto-reply:', replyError);
        return NextResponse.json({ 
          success: true, 
          message: 'SMS received and stored (auto-reply failed)',
          id: data.id,
          reply_sent: false,
          reply_error: replyError instanceof Error ? replyError.message : 'Unknown reply error'
        });
      }
    } catch (dbError) {
      console.error('Database storage failed, but SMS was received:', dbError);
      
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
          message: 'SMS received, logged, and auto-reply sent (storage pending database setup)',
          warning: 'Database storage failed - table may need creation',
          received_data: { From, Body, To, MessageSid },
          reply_sent: true
        });
      } catch (replyError) {
        console.error('Failed to send auto-reply:', replyError);
        return NextResponse.json({ 
          success: true, 
          message: 'SMS received and logged (storage pending database setup, auto-reply failed)',
          warning: 'Database storage failed - table may need creation',
          received_data: { From, Body, To, MessageSid },
          reply_sent: false,
          reply_error: replyError instanceof Error ? replyError.message : 'Unknown reply error'
        });
      }
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
    const { data, error } = await supabase
      .from('sms_messages')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Database error:', error);
      if (error.code === '42P01') {
        return NextResponse.json({ 
          success: true, 
          messages: [],
          warning: 'SMS messages table does not exist - needs to be created in Supabase'
        });
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      messages: data 
    });
  } catch (error) {
    console.error('SMS fetch error:', error);
    return NextResponse.json({ 
      success: true,
      messages: [],
      warning: 'Database access failed - table may need creation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
