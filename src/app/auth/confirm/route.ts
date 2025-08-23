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

  console.log("Auth callback params:", { token_hash, type, code, next, url: request.url });

  const supabase = await createSupabaseServer();

  if (code) {
    console.log("Processing OAuth callback with code");
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("OAuth exchangeCodeForSession result:", { error });

    if (!error) {
      console.log("OAuth authentication successful, redirecting to:", next);
      redirect(next);
    } else {
      console.log("OAuth authentication failed:", error.message);
      redirect("/signin?error=OAuth authentication failed");
    }
  }

  if (token_hash && type) {
    console.log("Processing magic link callback");
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log("Magic link verifyOtp result:", { error });

    if (!error) {
      console.log("Magic link authentication successful, redirecting to:", next);
      redirect(next);
    } else {
      console.log("Magic link authentication failed:", error.message);
      redirect("/signin?error=Magic link authentication failed");
    }
  }

  console.log("No valid authentication parameters found, redirecting to signin");
  redirect("/signin?error=Invalid authentication callback");
}
