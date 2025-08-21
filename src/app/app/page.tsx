// app/app/page.tsx
import { createServer } from "@/lib/supabase";

export default async function AppHome() {
  const supabase = createServer();
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
