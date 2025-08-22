import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const url = new URL(req.url);
    const isProtected = url.pathname.startsWith("/app");
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

  await supabase.auth.getUser();

  const url = new URL(req.url);
  const isProtected = url.pathname.startsWith("/app");
  if (isProtected) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const signin = new URL("/signin", req.url);
      signin.searchParams.set("redirect", url.pathname + url.search);
      return NextResponse.redirect(signin);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
};
