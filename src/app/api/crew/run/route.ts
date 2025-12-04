import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';

const CREW_SERVICE_URL = process.env.CREW_SERVICE_URL || 'https://blox12-production.up.railway.app';

interface CrewRunRequest {
  message: string;
  channel?: 'web' | 'email' | 'sms';
}

interface ToolUsed {
  agentName: string;
  toolKey: string;
  summary: string;
  invocationId?: string;
}

interface CrewRunResponse {
  success: boolean;
  reply?: string;
  toolsUsed?: ToolUsed[];
  error?: {
    code: string;
    message: string;
  };
  trace?: {
    tenant_id: string;
    channel: string;
    process: string;
    agents_available: string[];
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<CrewRunResponse>> {
  try {
    // Authenticate user and get tenant ID
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to use this feature.',
        },
      }, { status: 401 });
    }

    // For now, tenant_id equals user.id (single-user tenants)
    // This can be updated later for multi-user organizations
    const tenantId = user.id;
    const actorUserId = user.id;

    // Parse request body
    const body: CrewRunRequest = await request.json();
    const { message, channel = 'web' } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Message is required and must be a non-empty string.',
        },
      }, { status: 400 });
    }

    // Generate a run ID for correlating tool invocations
    const runId = crypto.randomUUID();

    try {
      // Call the Python crew service
      const crewResponse = await fetch(`${CREW_SERVICE_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.CREW_API_KEY || '',
          'X-Run-ID': runId,
        },
        body: JSON.stringify({
          tenantId,
          actorUserId,
          message: message.trim(),
          channel,
          runId,
        }),
      });

      if (!crewResponse.ok) {
        const errorText = await crewResponse.text();
        console.error('Crew service error:', crewResponse.status, errorText);
        
        return NextResponse.json({
          success: false,
          error: {
            code: 'CREW_SERVICE_ERROR',
            message: 'The AI service is temporarily unavailable. Please try again.',
          },
        }, { status: 502 });
      }

      const crewData = await crewResponse.json();

      // Extract tool usage from the response if available
      // The crew service may return toolsUsed in its response
      const toolsUsed: ToolUsed[] = crewData.toolsUsed || [];

      // If no toolsUsed in response, we can optionally query tool_invocations
      // for this runId to derive the list (commented out for now)
      // if (toolsUsed.length === 0) {
      //   const { data: invocations } = await supabase
      //     .from('tool_invocations')
      //     .select('agent_name, tool_key, payload')
      //     .eq('run_id', runId)
      //     .order('created_at', { ascending: true });
      //   
      //   if (invocations) {
      //     toolsUsed = invocations.map(inv => ({
      //       agentName: inv.agent_name,
      //       toolKey: inv.tool_key,
      //       summary: generateToolSummary(inv.tool_key, inv.payload),
      //     }));
      //   }
      // }

      return NextResponse.json({
        success: true,
        reply: crewData.result || crewData.reply || 'I processed your request.',
        toolsUsed,
        trace: crewData.trace,
      });

    } catch (fetchError) {
      console.error('Failed to reach crew service:', fetchError);
      
      return NextResponse.json({
        success: false,
        error: {
          code: 'CREW_SERVICE_UNREACHABLE',
          message: 'Unable to connect to the AI service. Please try again later.',
        },
      }, { status: 503 });
    }

  } catch (error) {
    console.error('Crew run API error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      },
    }, { status: 500 });
  }
}

// Helper function to generate human-readable tool summaries
function generateToolSummary(toolKey: string, payload: Record<string, unknown>): string {
  switch (toolKey) {
    case 'email':
      return `Email sent to ${payload.to}: "${payload.subject}"`;
    case 'sms':
      return `SMS sent to ${payload.to}`;
    case 'task':
      return `Task created: "${payload.title || payload.description}"`;
    default:
      return `Used ${toolKey} tool`;
  }
}
