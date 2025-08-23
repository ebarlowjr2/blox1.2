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

  console.log("Auth callback params:", { 
    token_hash: token_hash ? "present" : "missing", 
    type, 
    code: code ? "present" : "missing", 
    next, 
    url: request.url,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  const supabase = await createSupabaseServer();

  if (code) {
    console.log("Processing OAuth callback with code");
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log("OAuth exchangeCodeForSession result:", { data, error });

      if (!error && data?.session) {
        console.log("OAuth authentication successful, redirecting to:", next);
        redirect(next);
      } else {
        console.log("OAuth authentication failed:", error?.message || "No session returned");
        redirect("/signin?error=Could not authenticate user");
      }
    } catch (err) {
      console.log("OAuth callback error:", err);
      redirect("/signin?error=Authentication callback failed");
    }
  }

  if (token_hash && type) {
    console.log("Processing magic link callback");
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      console.log("Magic link verifyOtp result:", { data, error });

      if (!error && data?.session) {
        console.log("Magic link authentication successful, redirecting to:", next);
        redirect(next);
      } else {
        console.log("Magic link authentication failed:", error?.message || "No session returned");
        redirect("/signin?error=Magic link authentication failed");
      }
    } catch (err) {
      console.log("Magic link callback error:", err);
      redirect("/signin?error=Magic link verification failed");
    }
  }

  console.log("No valid authentication parameters found, redirecting to signin");
  redirect("/signin?error=Invalid authentication callback");
}
