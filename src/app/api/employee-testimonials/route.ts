import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createEmployeeTestimonial, listEmployeeTestimonials } from '@/backend/queries/employeeTestimonials';
import { isAdminRequest } from '@/backend/auth/session';

const createSchema = z.object({
  name: z.string().min(1).max(255),
  position: z.string().min(1).max(255),
  photoUrl: z.string().url().optional(),
  testimonial: z.string().min(1),
  order: z.number().int().optional(),
});

export async function GET() {
  try {
    const testimonials = await listEmployeeTestimonials();
    return NextResponse.json({ success: true, data: { testimonials } });
  } catch (error) {
    console.error('Error fetching employee testimonials:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch employee testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const body = createSchema.parse(await request.json());
    const testimonial = await createEmployeeTestimonial(body);
    return NextResponse.json({ success: true, data: { id: testimonial.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating employee testimonial:', error);
    return NextResponse.json({ success: false, error: 'Failed to create employee testimonial' }, { status: 500 });
  }
}