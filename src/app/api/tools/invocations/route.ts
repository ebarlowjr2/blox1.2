import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';

interface ToolInvocationRecord {
  id: string;
  tenant_id: string;
  agent_name: string;
  tool_key: string;
  payload: Record<string, unknown>;
  result: Record<string, unknown>;
  run_id: string | null;
  created_at: string;
}

interface InvocationsResponse {
  success: boolean;
  invocations?: ToolInvocationRecord[];
  error?: {
    code: string;
    message: string;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<InvocationsResponse>> {
  try {
    // Authenticate user
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to view activity.',
        },
      }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const toolKey = searchParams.get('tool_key');
    const agentName = searchParams.get('agent_name');

    // Build query - RLS will automatically filter by tenant_id = auth.uid()
    let query = supabase
      .from('tool_invocations')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply optional filters
    if (toolKey) {
      query = query.eq('tool_key', toolKey);
    }
    if (agentName) {
      query = query.eq('agent_name', agentName);
    }

    const { data: invocations, error: queryError } = await query;

    if (queryError) {
      console.error('Failed to fetch tool invocations:', queryError);
      return NextResponse.json({
        success: false,
        error: {
          code: 'QUERY_ERROR',
          message: 'Failed to fetch activity log.',
        },
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      invocations: invocations || [],
    });

  } catch (error) {
    console.error('Tool invocations API error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
      },
    }, { status: 500 });
  }
}
