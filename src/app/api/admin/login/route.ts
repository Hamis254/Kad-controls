/**
 * Admin Login Route
 * POST /api/admin/login - { password } -> sets an admin session cookie on success.
 * There are no individual admin accounts, just one shared password (ADMIN_PASSWORD).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { setAdminSessionCookie, verifyAdminPassword } from '@/backend/auth/session';

const loginSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const { password } = loginSchema.parse(await request.json());

    if (!verifyAdminPassword(password)) {
      // Same generic message either way — don't reveal whether ADMIN_PASSWORD is even configured.
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    setAdminSessionCookie(response);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }
    console.error('Error during admin login:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
