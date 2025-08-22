// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
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

  // create a response we can mutate
  let res = NextResponse.next({ request: { headers: req.headers } });

  // bind a server client to request/response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // ensures auth cookies are kept in sync during OAuth/email-link callback
  await supabase.auth.getUser();

  // protect any path under /app (change to your real protected prefix)
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
