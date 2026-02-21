// app/app/page.tsx
// AUTH DISABLED TEMPORARILY — restore createSupabaseServer import and auth
// logic to re-enable Supabase authentication.

export default async function AppHome() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Welcome to BLOX</h1>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-yellow-800 font-medium">Development Mode</p>
        <p className="text-sm text-yellow-700 mt-1">Authentication is temporarily disabled.</p>
      </div>
    </main>
  );
}
