import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/app";

  console.log("Auth callback params:", { code, token_hash, type, next, url: request.url });

  const supabase = await createSupabaseServer();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("ExchangeCodeForSession result:", { error });

    if (!error) {
      console.log("OAuth authentication successful, redirecting to:", next);
      redirect(next);
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log("VerifyOtp result:", { error });

    if (!error) {
      console.log("Magic link authentication successful, redirecting to:", next);
      redirect(next);
    }
  }

  console.log("Authentication failed or missing parameters, redirecting to signin");
  redirect("/signin?error=Could not authenticate user");
}
