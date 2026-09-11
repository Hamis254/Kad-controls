import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/backend/auth/session';

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
