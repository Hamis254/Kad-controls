import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/backend/auth/session';

/**
 * Server-side gate for every /admin/* route (except the login page itself). This
 * runs BEFORE any admin page is rendered or sent to the browser — a visitor
 * without a valid admin session never receives the page's HTML/JS at all, they
 * just get redirected to /admin/login.
 *
 * This is a fast, self-contained check (just verifies the session cookie's
 * signature) — no database involved, which keeps every /admin/* request cheap.
 * Every write still goes through its own /api/* route, which independently
 * checks isAdminRequest() again server-side before touching the database — this
 * middleware is defense in depth on top of that, not a replacement for it.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (!isAdminRequest(request)) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
