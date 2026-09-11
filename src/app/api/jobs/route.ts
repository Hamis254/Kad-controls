import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createJobPosting, listAllJobPostings, listOpenJobPostings } from '@/backend/queries/jobs';
import { isAdminRequest } from '@/backend/auth/session';

const createSchema = z.object({
  title: z.string().min(1).max(255),
  department: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship']).optional(),
  description: z.string().min(1).max(10000),
  isOpen: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const includeAll = request.nextUrl.searchParams.get('all') === 'true' && isAdminRequest(request);
    const jobs = includeAll ? await listAllJobPostings() : await listOpenJobPostings();
    return NextResponse.json({ success: true, data: { jobs } });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const body = createSchema.parse(await request.json());
    const job = await createJobPosting(body);
    return NextResponse.json({ success: true, data: { id: job.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating job posting:', error);
    return NextResponse.json({ success: false, error: 'Failed to create job posting' }, { status: 500 });
  }
}
