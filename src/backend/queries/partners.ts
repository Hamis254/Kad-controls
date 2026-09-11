import { asc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { partners } from '@/backend/db/schema';

export async function listPartners() {
  return db.query.partners.findMany({ orderBy: [asc(partners.order), asc(partners.createdAt)] });
}

export async function createPartner(input: { name: string; role: string; description?: string; logoUrl?: string; order?: number }) {
  const [created] = await db.insert(partners).values(input).returning();
  return created;
}

export async function updatePartner(
  id: string,
  input: Partial<{ name: string; role: string; description: string; logoUrl: string; order: number }>
) {
  const [updated] = await db.update(partners).set(input).where(eq(partners.id, id)).returning();
  return updated ?? null;
}

export async function deletePartner(id: string) {
  await db.delete(partners).where(eq(partners.id, id));
}
