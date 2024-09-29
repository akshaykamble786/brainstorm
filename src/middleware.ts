import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Ensure `origin` matches `x-forwarded-host`
  const forwardedHost = req.headers.get('x-forwarded-host');
  const origin = req.headers.get('origin');

  if (forwardedHost && origin && forwardedHost !== origin) {
    const newHeaders = new Headers(req.headers);
    newHeaders.set('origin', `https://${forwardedHost}`);
    return NextResponse.next({
      request: {
        headers: newHeaders,
      },
    });
  }

  // Check Supabase session for authenticated routes
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect if accessing protected dashboard without a session
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect if email link error is present
  const emailLinkError = "Email link is invalid or has expired";
  if (
    req.nextUrl.searchParams.get("error_description") === emailLinkError &&
    req.nextUrl.pathname !== "/signup"
  ) {
    return NextResponse.redirect(
      new URL(
        `/signup?error_description=${req.nextUrl.searchParams.get(
          "error_description"
        )}`,
        req.url
      )
    );
  }

  // Redirect to dashboard if session exists on login/signup pages
  if (["/login", "/signup"].includes(req.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}
