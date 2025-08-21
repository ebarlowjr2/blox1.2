// src/lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServer() {
  const c = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => c.get(name)?.value,
        set: (name, value, options) => {
          c.set({ name, value, ...options });
        },
        remove: (name, options) => {
          c.set({ name, value: "", ...options });
        },
      },
    }
  );
}
