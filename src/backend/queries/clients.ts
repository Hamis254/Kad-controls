import { asc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { clients } from '@/backend/db/schema';

export async function listClients() {
  return db.query.clients.findMany({ orderBy: [asc(clients.order), asc(clients.createdAt)] });
}

export async function createClient(input: { name: string; logoUrl?: string; order?: number }) {
  const [created] = await db.insert(clients).values(input).returning();
  return created;
}

export async function updateClient(
  id: string,
  input: Partial<{ name: string; logoUrl: string; order: number }>
) {
  const [updated] = await db.update(clients).set(input).where(eq(clients.id, id)).returning();
  return updated ?? null;
}

export async function deleteClient(id: string) {
  await db.delete(clients).where(eq(clients.id, id));
}
