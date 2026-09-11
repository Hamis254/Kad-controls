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

export async function deleteClient(id: string) {
  await db.delete(clients).where(eq(clients.id, id));
}
