// src/lib/supabase-browser.ts
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      }
    } as any;
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey);
}
