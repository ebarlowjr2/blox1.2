// src/lib/supabase-admin.ts
// Server-side Supabase client with service role key for admin operations
// Use this for inserting tool_invocations and other system-level operations

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not set - admin operations will fail');
    return null;
  }

  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set - admin operations will fail');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Type definitions for tool_invocations table
export interface ToolInvocation {
  id?: string;
  tenant_id: string;
  user_id?: string;
  agent_name: string;
  tool_key: string;
  payload: Record<string, unknown>;
  result: Record<string, unknown>;
  run_id?: string;
  created_at?: string;
}

// Helper function to log a tool invocation
export async function logToolInvocation(invocation: Omit<ToolInvocation, 'id' | 'created_at'>): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabaseAdmin = createSupabaseAdmin();
  
  if (!supabaseAdmin) {
    console.error('Cannot log tool invocation: Supabase admin client not available');
    return { success: false, error: 'Database not configured' };
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .from('tool_invocations')
      .insert({
        tenant_id: invocation.tenant_id,
        user_id: invocation.user_id,
        agent_name: invocation.agent_name,
        tool_key: invocation.tool_key,
        payload: invocation.payload,
        result: invocation.result,
        run_id: invocation.run_id,
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Failed to log tool invocation:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Error logging tool invocation:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
