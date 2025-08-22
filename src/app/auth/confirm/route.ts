import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/app";

  console.log("Auth callback params:", { token_hash, type, next, url: request.url });

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  if (!token_hash || !type) {
    console.log("Missing parameters, redirecting to signin");
    redirectTo.pathname = "/signin";
    redirectTo.searchParams.set("error", "Invalid confirmation link");
    return NextResponse.redirect(redirectTo);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  console.log("VerifyOtp result:", { error });

  if (!error) {
    console.log("Authentication successful, redirecting to:", redirectTo.pathname);
    return NextResponse.redirect(redirectTo);
  }

  console.log("Authentication failed:", error.message);
  redirectTo.pathname = "/signin";
  redirectTo.searchParams.set("error", "Could not authenticate user");
  return NextResponse.redirect(redirectTo);
}
