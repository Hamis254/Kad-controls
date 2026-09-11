import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, listClients } from '@/backend/queries/clients';
import { isAdminRequest } from '@/backend/auth/session';

const createSchema = z.object({
  name: z.string().min(1).max(255),
  logoUrl: z.string().url().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  try {
    const clients = await listClients();
    return NextResponse.json({ success: true, data: { clients } });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const body = createSchema.parse(await request.json());
    const client = await createClient(body);
    return NextResponse.json({ success: true, data: { id: client.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating client:', error);
    return NextResponse.json({ success: false, error: 'Failed to create client' }, { status: 500 });
  }
}
