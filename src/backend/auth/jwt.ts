/**
 * Minimal, dependency-free HMAC-SHA256 JWT (HS256) sign/verify.
 * We hand-roll this instead of pulling in `jsonwebtoken`/`jose` because
 * the payloads here are tiny and the security properties we need
 * (tamper-evident, expiring, server-signed) don't need a full library.
 */
import { createHmac, timingSafeEqual } from 'crypto';

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(input: string) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, 'base64');
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'JWT_SECRET environment variable is not set (or is too short). Set a random 32+ char secret.'
    );
  }
  return secret;
}

export interface JwtPayload {
  [key: string]: unknown;
  exp?: number;
  iat?: number;
}

export function signJwt(payload: JwtPayload, expiresInSeconds: number): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(fullPayload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = createHmac('sha256', getSecret()).update(signingInput).digest();
  const encodedSignature = base64url(signature);

  return `${signingInput}.${encodedSignature}`;
}

/** Returns the decoded payload, or null if the token is missing, malformed, expired, or tampered with. */
export function verifyJwt<T extends JwtPayload = JwtPayload>(token: string | undefined | null): T | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  try {
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createHmac('sha256', getSecret()).update(signingInput).digest();
    const actualSignature = base64urlDecode(encodedSignature);

    if (
      expectedSignature.length !== actualSignature.length ||
      !timingSafeEqual(expectedSignature, actualSignature)
    ) {
      return null;
    }

    const payload = JSON.parse(base64urlDecode(encodedPayload).toString('utf8')) as T;

    if (typeof payload.exp === 'number' && Math.floor(Date.now() / 1000) >= payload.exp) {
      return null; // expired
    }

    return payload;
  } catch {
    return null;
  }
}
