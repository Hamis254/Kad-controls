import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createProject, listProjects } from '@/backend/queries/projects';
import { isAdminRequest } from '@/backend/auth/session';

const createSchema = z.object({
  title: z.string().min(1).max(255),
  clientName: z.string().max(255).optional(),
  summary: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
  isPublished: z.boolean().optional(),
  media: z
    .array(
      z.object({
        type: z.enum(['image', 'video']),
        url: z.string().url(),
        caption: z.string().max(255).optional(),
        order: z.number().int().optional(),
      })
    )
    .optional(),
});

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ success: true, data: { projects } });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const body = createSchema.parse(await request.json());
    const project = await createProject(body);
    return NextResponse.json({ success: true, data: { id: project.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
