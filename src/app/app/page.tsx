// app/app/page.tsx
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function AppHome() {
  let userData = null;
  let error = null;

  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.auth.getUser();
    userData = data.user;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Authentication not configured';
  }
  
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Welcome to BLOX</h1>
      {error ? (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">Authentication Error: {error}</p>
          <p className="text-sm text-red-600 mt-2">Please configure Supabase environment variables.</p>
        </div>
      ) : (
        <pre className="mt-4 text-sm bg-slate-50 p-3 rounded-xl border">
          {JSON.stringify(userData, null, 2)}
        </pre>
      )}
    </main>
  );
}
