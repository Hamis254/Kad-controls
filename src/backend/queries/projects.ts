import { desc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { projectMedia, projects } from '@/backend/db/schema';

export async function listProjects() {
  return db.query.projects.findMany({
    where: eq(projects.isPublished, true),
    with: { media: { orderBy: (m, { asc }) => [asc(m.order)] } },
    orderBy: [desc(projects.createdAt)],
  });
}

export async function findProjectById(id: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: { media: { orderBy: (m, { asc }) => [asc(m.order)] } },
  });
}

export interface ProjectInput {
  title: string;
  clientName?: string;
  summary?: string;
  description?: string;
  isPublished?: boolean;
  media?: { type: 'image' | 'video'; url: string; caption?: string; order?: number }[];
}

export async function createProject(input: ProjectInput) {
  return db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({
        title: input.title,
        clientName: input.clientName,
        summary: input.summary,
        description: input.description,
        isPublished: input.isPublished ?? true,
      })
      .returning();

    if (input.media?.length) {
      await tx.insert(projectMedia).values(
        input.media.map((m, idx) => ({
          projectId: project.id,
          type: m.type,
          url: m.url,
          caption: m.caption,
          order: m.order ?? idx,
        }))
      );
    }

    return project;
  });
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
}
