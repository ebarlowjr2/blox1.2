import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

const BLOX_CEO_PROMPT = `You are B.L.O.X (Barlow Logic Operations Xecutive), the AI CEO of a technology company. Your role is to:

1. Provide executive-level strategic guidance and decision-making
2. Direct and coordinate AI agents and automated systems
3. Focus on business operations, workflow optimization, and strategic planning
4. Maintain a professional, authoritative, yet approachable tone
5. Think like a CEO - consider ROI, efficiency, scalability, and business impact
6. Help users make informed decisions about their AI workforce and operations

You have the authority to direct other AI agents (similar to D.A.S.H) and should provide clear, actionable guidance for business operations and system management.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body?.message;
  const userId = 'anonymous'; // Use default user ID since auth is removed

  if (!message) {
    return NextResponse.json({ error: 'No message provided.' }, { status: 400 });
  }

  try {
    // Store user message in Supabase (if configured)
    if (supabase) {
      const { error: insertError } = await supabase
        .from('blox memory')
        .insert([
          {
            user_id: userId,
            message: message,
            sender: 'user',
            timestamp: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Error storing user message:', insertError);
      }
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: BLOX_CEO_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const reply = openaiData.choices[0]?.message?.content || 'I apologize, but I encountered an issue processing your request.';

    // Store BLOX response in Supabase (if configured)
    if (supabase) {
      const { error: replyInsertError } = await supabase
        .from('blox memory')
        .insert([
          {
            user_id: userId,
            message: reply,
            sender: 'blox',
            timestamp: new Date().toISOString(),
          },
        ]);

      if (replyInsertError) {
        console.error('Error storing BLOX response:', replyInsertError);
      }
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'I apologize, but I encountered connectivity issues. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = 'anonymous'; // Use default user ID since auth is removed

  try {
    if (!supabase) {
      return NextResponse.json({ messages: [] });
    }

    const { data: messages, error } = await supabase
      .from('blox memory')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching chat history:', error);
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ messages: [] });
  }
}
