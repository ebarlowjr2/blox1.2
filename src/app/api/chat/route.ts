import { NextRequest, NextResponse } from 'next/server';
import { withTenant, ApiRequest, logActivity } from '@/lib/api-middleware';
import { createSupabaseServer } from '@/lib/supabase-server';

const BLOX_CEO_PROMPT = `You are B.L.O.X (Barlow Logic Operations Xecutive), the AI CEO of a technology company. Your role is to:

1. Provide executive-level strategic guidance and decision-making
2. Direct and coordinate AI agents and automated systems
3. Focus on business operations, workflow optimization, and strategic planning
4. Maintain a professional, authoritative, yet approachable tone
5. Think like a CEO - consider ROI, efficiency, scalability, and business impact
6. Help users make informed decisions about their AI workforce and operations

You have the authority to direct other AI agents (similar to D.A.S.H) and should provide clear, actionable guidance for business operations and system management.`;

export const POST = withTenant(async (req: ApiRequest) => {
  const body = await req.json();
  const message = body?.message;

  if (!message) {
    return NextResponse.json({ error: 'No message provided.' }, { status: 400 });
  }

  try {
    const { tenantId, userId } = req.ctx!;
    const supabase = await createSupabaseServer();

    const { data: ceoAgent } = await supabase
      .from("agents")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("kind", "CEO")
      .single();

    await supabase.from("messages").insert({
      tenant_id: tenantId,
      agent_id: ceoAgent?.id || null,
      channel: "chat",
      direction: "inbound",
      from_address: userId,
      to_address: "blox-ceo",
      content: message,
    });

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

    await supabase.from("messages").insert({
      tenant_id: tenantId,
      agent_id: ceoAgent?.id || null,
      channel: "chat",
      direction: "outbound",
      from_address: "blox-ceo",
      to_address: userId,
      content: reply,
    });

    await logActivity(tenantId, "message_sent", {
      agentId: ceoAgent?.id,
      userId,
      entityType: "message",
      metadata: { channel: "chat" },
    });

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'I apologize, but I encountered connectivity issues. Please try again.' 
    }, { status: 500 });
  }
});

export const GET = withTenant(async (req: ApiRequest) => {
  try {
    const { tenantId } = req.ctx!;
    const supabase = await createSupabaseServer();

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("channel", "chat")
      .order("created_at", { ascending: true })
      .limit(50);

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ messages: [] });
  }
});
