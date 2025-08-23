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
  const state = searchParams.get("state");
  const session_state = searchParams.get("session_state");

  console.log("=== AUTH CALLBACK ROUTE TRIGGERED ===");
  console.log("Full URL:", request.url);
  console.log("All search params:", Object.fromEntries(searchParams.entries()));
  console.log("Headers:", {
    userAgent: request.headers.get("user-agent"),
    referer: request.headers.get("referer"),
    host: request.headers.get("host"),
    origin: request.headers.get("origin")
  });
  console.log("Parsed params:", { 
    token_hash: token_hash ? `present (${token_hash.substring(0, 10)}...)` : "missing", 
    type, 
    code: code ? `present (${code.substring(0, 10)}...)` : "missing", 
    next, 
    error_param,
    error_description,
    state: state ? `present (${state.substring(0, 10)}...)` : "missing",
    session_state: session_state ? "present" : "missing"
  });

  if (error_param) {
    console.log("OAuth error received:", { error_param, error_description });
    redirect(`/signin?error=OAuth error: ${error_param} - ${error_description || "Unknown error"}`);
  }

  const supabase = await createSupabaseServer();

  if (code) {
    console.log("=== PROCESSING OAUTH CALLBACK WITH CODE ===");
    console.log("Authorization code received:", code.substring(0, 20) + "...");
    
    try {
      console.log("Attempting to exchange code for session...");
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log("=== EXCHANGE CODE FOR SESSION RESULT ===");
      if (data) {
        console.log("Data received:", {
          session: data.session ? {
            access_token: data.session.access_token ? "present" : "missing",
            refresh_token: data.session.refresh_token ? "present" : "missing",
            expires_at: data.session.expires_at,
            token_type: data.session.token_type,
            user_id: data.session.user?.id
          } : "no_session",
          user: data.user ? {
            id: data.user.id,
            email: data.user.email,
            provider: data.user.app_metadata?.provider
          } : "no_user"
        });
      } else {
        console.log("No data returned from exchangeCodeForSession");
      }
      
      if (error) {
        console.log("Error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        });
      }

      if (!error && data?.session) {
        console.log("=== OAUTH AUTHENTICATION SUCCESSFUL ===");
        console.log("Redirecting to:", next);
        redirect(next);
      } else {
        const errorMsg = error?.message || "No session returned";
        console.log("=== OAUTH AUTHENTICATION FAILED ===");
        console.log("Failure reason:", errorMsg);
        
        if (error?.message?.includes("code_verifier")) {
          console.log("PKCE code verifier issue detected");
          redirect("/signin?error=OAuth authentication failed: PKCE code verifier missing or invalid. Please try signing in again.");
        } else if (error?.message?.includes("invalid_grant")) {
          console.log("Invalid authorization code detected");
          redirect("/signin?error=OAuth authentication failed: Invalid authorization code. Please try signing in again.");
        } else if (error?.message?.includes("expired")) {
          console.log("Expired code detected");
          redirect("/signin?error=OAuth authentication failed: Authorization code expired. Please try signing in again.");
        } else {
          redirect(`/signin?error=OAuth authentication failed: ${errorMsg}. Please try signing in again.`);
        }
      }
    } catch (err) {
      console.log("=== OAUTH CALLBACK EXCEPTION ===");
      console.log("Exception details:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      redirect(`/signin?error=Authentication callback failed: ${errorMsg}. Please try signing in again.`);
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
