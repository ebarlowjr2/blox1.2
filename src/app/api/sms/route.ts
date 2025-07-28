import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
          return NextResponse.json({ 
            success: true, 
            message: 'SMS received and logged (database table pending creation)',
            warning: 'SMS messages table needs to be created in Supabase',
            received_data: { From, Body, To, MessageSid }
          });
        }
        throw error;
      }

      console.log('SMS message stored:', data);
      
      return NextResponse.json({ 
        success: true, 
        message: 'SMS received and stored',
        id: data.id 
      });
    } catch (dbError) {
      console.error('Database storage failed, but SMS was received:', dbError);
      return NextResponse.json({ 
        success: true, 
        message: 'SMS received and logged (storage pending database setup)',
        warning: 'Database storage failed - table may need creation',
        received_data: { From, Body, To, MessageSid }
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
