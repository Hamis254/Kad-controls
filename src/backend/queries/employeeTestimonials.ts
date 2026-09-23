import { asc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { employeeTestimonials } from '@/backend/db/schema';

export async function listEmployeeTestimonials() {
  return db.query.employeeTestimonials.findMany({
    orderBy: [asc(employeeTestimonials.order), asc(employeeTestimonials.createdAt)],
  });
}

export async function createEmployeeTestimonial(input: {
  name: string;
  position: string;
  photoUrl?: string;
  testimonial: string;
  order?: number;
}) {
  const [created] = await db.insert(employeeTestimonials).values(input).returning();
  return created;
}

export async function updateEmployeeTestimonial(
  id: string,
  input: Partial<{ name: string; position: string; photoUrl: string; testimonial: string; order: number }>
) {
  const [updated] = await db.update(employeeTestimonials).set(input).where(eq(employeeTestimonials.id, id)).returning();
  return updated ?? null;
}