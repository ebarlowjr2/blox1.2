import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const url = new URL(req.url);
    const isProtected = url.pathname.startsWith("/app") || url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/onboarding");
    if (isProtected) {
      const signin = new URL("/signin", req.url);
      signin.searchParams.set("redirect", url.pathname + url.search);
      return NextResponse.redirect(signin);
    }
    return NextResponse.next();
  }

  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: "", ...options });
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const url = new URL(req.url);
  const isProtected = url.pathname.startsWith("/app") || url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/onboarding");
  
  if (isProtected) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const signin = new URL("/signin", req.url);
      signin.searchParams.set("redirect", url.pathname + url.search);
      return NextResponse.redirect(signin);
    }

    if (user?.id && !url.pathname.startsWith("/onboarding")) {
      const { data: membership } = await supabase
        .from("tenant_members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!membership) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }

      const activeTenantId = req.cookies.get("active_tenant_id")?.value;
      if (!activeTenantId && membership.tenant_id) {
        res.cookies.set("active_tenant_id", membership.tenant_id, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 365,
        });
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health|api/stripe/webhook|auth).*)"],
};
