import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateEmployeeTestimonial } from '@/backend/queries/employeeTestimonials';
import { isAdminRequest } from '@/backend/auth/session';

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  position: z.string().min(1).max(255).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  testimonial: z.string().min(1).optional(),
  order: z.number().int().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = updateSchema.parse(await request.json());
    const updated = await updateEmployeeTestimonial(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Employee testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { testimonial: updated } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error updating employee testimonial:', error);
    return NextResponse.json({ success: false, error: 'Failed to update employee testimonial' }, { status: 500 });
  }
}