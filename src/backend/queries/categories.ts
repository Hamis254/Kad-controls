import { asc, eq, isNull } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { categories } from '@/backend/db/schema';

export async function listCategories() {
  return db.query.categories.findMany({ orderBy: [asc(categories.name)] });
}

/** Top-level categories with their subcategories nested — what the public site renders. */
export async function listCategoriesTree() {
  return db.query.categories.findMany({
    where: isNull(categories.parentId),
    with: { children: { orderBy: (c, { asc: a }) => [a(c.name)] } },
    orderBy: [asc(categories.name)],
  });
}

export async function findCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({ where: eq(categories.slug, slug) });
}

export async function findCategoryById(id: string) {
  return db.query.categories.findFirst({ where: eq(categories.id, id) });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createCategory(input: { name: string; description?: string; image?: string; parentId?: string }) {
  const slug = slugify(input.name);
  const [created] = await db
    .insert(categories)
    .values({ name: input.name, description: input.description, image: input.image, parentId: input.parentId, slug })
    .returning();
  return created;
}
