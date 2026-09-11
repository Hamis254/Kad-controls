import { desc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { jobPostings } from '@/backend/db/schema';

export async function listOpenJobPostings() {
  return db.query.jobPostings.findMany({
    where: eq(jobPostings.isOpen, true),
    orderBy: [desc(jobPostings.createdAt)],
  });
}

export async function listAllJobPostings() {
  return db.query.jobPostings.findMany({ orderBy: [desc(jobPostings.createdAt)] });
}

export async function createJobPosting(input: {
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  description: string;
  isOpen?: boolean;
}) {
  const [created] = await db.insert(jobPostings).values(input).returning();
  return created;
}

export async function setJobPostingOpen(id: string, isOpen: boolean) {
  const [updated] = await db.update(jobPostings).set({ isOpen }).where(eq(jobPostings.id, id)).returning();
  return updated ?? null;
}

export async function deleteJobPosting(id: string) {
  await db.delete(jobPostings).where(eq(jobPostings.id, id));
}
