/**
 * Single Partner API Route
 * PATCH /api/partners/:id - update a partner (admin only) — this is what lets you
 * add a logoUrl to a partner that was created (or seeded) without one.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updatePartner } from '@/backend/queries/partners';
import { isAdminRequest } from '@/backend/auth/session';

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  order: z.number().int().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = updateSchema.parse(await request.json());

    const updated = await updatePartner(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { partner: updated } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error updating partner:', error);
    return NextResponse.json({ success: false, error: 'Failed to update partner' }, { status: 500 });
  }
}
