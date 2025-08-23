import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";
  const error_param = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  console.log("Auth callback params:", { 
    token_hash: token_hash ? "present" : "missing", 
    type, 
    code: code ? "present" : "missing", 
    next, 
    error_param,
    error_description,
    url: request.url,
    searchParams: Object.fromEntries(searchParams.entries()),
    userAgent: request.headers.get("user-agent"),
    referer: request.headers.get("referer")
  });

  if (error_param) {
    console.log("OAuth error received:", { error_param, error_description });
    redirect(`/signin?error=OAuth error: ${error_param} - ${error_description || "Unknown error"}`);
  }

  const supabase = await createSupabaseServer();

  if (code) {
    console.log("Processing OAuth callback with code");
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log("OAuth exchangeCodeForSession result:", { 
        data: data ? {
          session: data.session ? "present" : "missing",
          user: data.user ? "present" : "missing",
          sessionId: data.session?.access_token ? "token_present" : "no_token"
        } : "no_data",
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : "no_error"
      });

      if (!error && data?.session) {
        console.log("OAuth authentication successful, redirecting to:", next);
        redirect(next);
      } else {
        const errorMsg = error?.message || "No session returned";
        console.log("OAuth authentication failed:", errorMsg);
        
        if (error?.message?.includes("code_verifier")) {
          redirect("/signin?error=OAuth authentication failed: PKCE code verifier missing or invalid");
        } else if (error?.message?.includes("invalid_grant")) {
          redirect("/signin?error=OAuth authentication failed: Invalid authorization code");
        } else {
          redirect(`/signin?error=OAuth authentication failed: ${errorMsg}`);
        }
      }
    } catch (err) {
      console.log("OAuth callback error:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      redirect(`/signin?error=Authentication callback failed: ${errorMsg}`);
    }
  }

  if (token_hash && type) {
    console.log("Processing magic link callback");
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      console.log("Magic link verifyOtp result:", { 
        data: data ? {
          session: data.session ? "present" : "missing",
          user: data.user ? "present" : "missing"
        } : "no_data",
        error: error ? {
          message: error.message,
          status: error.status
        } : "no_error"
      });

      if (!error && data?.session) {
        console.log("Magic link authentication successful, redirecting to:", next);
        redirect(next);
      } else {
        const errorMsg = error?.message || "No session returned";
        console.log("Magic link authentication failed:", errorMsg);
        redirect(`/signin?error=Magic link authentication failed: ${errorMsg}`);
      }
    } catch (err) {
      console.log("Magic link callback error:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      redirect(`/signin?error=Magic link verification failed: ${errorMsg}`);
    }
  }

  console.log("No valid authentication parameters found, redirecting to signin");
  redirect("/signin?error=Invalid authentication callback - no code or token_hash provided");
}
