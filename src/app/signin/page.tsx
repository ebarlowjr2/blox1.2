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
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BLOX</h1>
          <p className="text-gray-600">Sign in to access your AI business automation dashboard</p>
        </div>
        
        {msg && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${
            msg.includes("Error") || msg.includes("Could not") ? 
            "bg-red-50 text-red-700 border border-red-200" : 
            "bg-green-50 text-green-700 border border-green-200"
          }`}>
            {msg}
          </div>
        )}

        <div className="space-y-4">
          {/* Primary Google OAuth Button */}
          <button
            onClick={() => signInWithProvider("google")}
            disabled={loading}
            className="w-full px-6 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-3 text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Magic Link Form */}
          <form onSubmit={signInWithEmail} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        </div>
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
