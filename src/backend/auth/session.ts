import { randomUUID, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { signJwt, verifyJwt, JwtPayload } from './jwt';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const CART_SID_COOKIE = 'cart_sid';
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

interface AdminSessionPayload extends JwtPayload {
  admin: true;
}

/**
 * Single shared admin password (set via ADMIN_PASSWORD env var) — there are no
 * individual admin accounts. Compared with a timing-safe check so response time
 * doesn't leak how many characters matched.
 */
export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error('ADMIN_PASSWORD environment variable is not set — admin login will always fail.');
    return false;
  }

  const expectedBuf = Buffer.from(expected);
  const candidateBuf = Buffer.from(candidate);
  // Buffers must be equal length for timingSafeEqual — pad the shorter one so a
  // length mismatch doesn't short-circuit the comparison (and doesn't throw).
  const maxLen = Math.max(expectedBuf.length, candidateBuf.length, 1);
  const a = Buffer.alloc(maxLen);
  const b = Buffer.alloc(maxLen);
  expectedBuf.copy(a);
  candidateBuf.copy(b);

  return timingSafeEqual(a, b) && expectedBuf.length === candidateBuf.length;
}

/** Reads and verifies the admin session cookie. Returns true only if it's a valid, unexpired admin session. */
export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const payload = verifyJwt<AdminSessionPayload>(token);
  return !!payload?.admin;
}

export function setAdminSessionCookie(response: NextResponse) {
  const token = signJwt({ admin: true }, ADMIN_SESSION_TTL_SECONDS);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
}

/**
 * Every visitor gets a stable anonymous cart-session id so their quote list
 * persists server-side across requests. There are no customer accounts, so this
 * is the only thing identifying a visitor's cart.
 */
export function getOrCreateCartSid(request: NextRequest, response: NextResponse): string {
  const existing = request.cookies.get(CART_SID_COOKIE)?.value;
  if (existing) return existing;

  const sid = randomUUID();
  response.cookies.set(CART_SID_COOKIE, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90, // 90 days
  });
  return sid;
}
