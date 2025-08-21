// lib/supabase.ts
import { cookies } from "next/headers";
import { createServerClient, createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // browser client
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createServer() {
  // server client using cookies
  const c = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return c.get(name)?.value; },
        set(name: string, value: string, options: any) { c.set({ name, value, ...options }); },
        remove(name: string, options: any) { c.set({ name, value: "", ...options }); }
      }
    }
  );
}
