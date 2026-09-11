import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPartner, listPartners } from '@/backend/queries/partners';
import { isAdminRequest } from '@/backend/auth/session';

const createSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  logoUrl: z.string().url().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  try {
    const partners = await listPartners();
    return NextResponse.json({ success: true, data: { partners } });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const body = createSchema.parse(await request.json());
    const partner = await createPartner(body);
    return NextResponse.json({ success: true, data: { id: partner.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating partner:', error);
    return NextResponse.json({ success: false, error: 'Failed to create partner' }, { status: 500 });
  }
}
