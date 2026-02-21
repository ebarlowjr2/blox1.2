import { NextRequest, NextResponse } from 'next/server';

// AUTH DISABLED TEMPORARILY — restore createSupabaseServer import and auth
// logic below to re-enable Supabase authentication.

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
    // AUTH DISABLED TEMPORARILY — returning empty invocations list
    // Restore Supabase auth + query logic to re-enable.

    return NextResponse.json({
      success: true,
      invocations: [],
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
