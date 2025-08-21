// app/app/page.tsx
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function AppHome() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Welcome to BLOX</h1>
      <pre className="mt-4 text-sm bg-slate-50 p-3 rounded-xl border">
        {JSON.stringify(data.user, null, 2)}
      </pre>
    </main>
  );
}
