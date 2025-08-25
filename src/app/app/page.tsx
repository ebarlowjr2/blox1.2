import { getSession } from '@auth0/nextjs-auth0';

export default async function AppHome() {
  const session = await getSession();
  const user = session?.user;
  
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Welcome to BLOX</h1>
      {user ? (
        <pre className="mt-4 text-sm bg-slate-50 p-3 rounded-xl border">
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">No user session found</p>
        </div>
      )}
    </main>
  );
}
