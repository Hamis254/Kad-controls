import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteClient, updateClient } from '@/backend/queries/clients';
import { isAdminRequest } from '@/backend/auth/session';

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
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
    const updated = await updateClient(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { client: updated } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error updating client:', error);
    return NextResponse.json({ success: false, error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await deleteClient(id);
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete client' }, { status: 500 });
  }
}