// app/signin/page.tsx
"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from "@/lib/supabase-browser";

function SignInForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/app";
  const error = params.get("error");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(error || null);

  const getSupabase = () => {
    try {
      return createSupabaseBrowser();
    } catch (error) {
      return null;
    }
  };

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      setMsg("Authentication not configured. Please contact administrator.");
      return;
    }
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/confirm?next=${redirect}` }
    });
    setLoading(false);
    setMsg(error ? `Error: ${error.message}` : "Magic link sent! Check your email.");
  }

  async function signInWithProvider(provider: "google" | "azure") {
    setLoading(true); setMsg(null);
    
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      setMsg("Authentication not configured. Please contact administrator.");
      return;
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/confirm?next=${redirect}` }
    });
    if (error) { setLoading(false); setMsg(`Error: ${error.message}`); }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="max-w-sm w-full rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold mb-2">Sign in to BLOX</h1>
        <form onSubmit={signInWithEmail} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 text-white py-2 text-sm"
          >
            {loading ? "Sending..." : "Send magic link"}
          </button>
        </form>

        <div className="my-3 h-px bg-slate-200" />
        <div className="grid gap-2">
          <button onClick={()=>signInWithProvider("google")} className="rounded-xl border py-2 text-sm">
            Continue with Google
          </button>
          {/* If you enabled Microsoft in Supabase, use 'azure' */}
          {/* <button onClick={()=>signInWithProvider("azure")} className="rounded-xl border py-2 text-sm">
            Continue with Microsoft
          </button> */}
        </div>

        {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
