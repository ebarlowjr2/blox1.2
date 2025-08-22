import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("MIDDLEWARE EXECUTING FOR:", request.url);
  
  const url = new URL(request.url);
  
  if (url.pathname.startsWith("/app")) {
    console.log("REDIRECTING /app to /signin");
    const signin = new URL("/signin", request.url);
    signin.searchParams.set("redirect", url.pathname + url.search);
    return NextResponse.redirect(signin);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/(.*)",
};
