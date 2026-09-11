import { and, count, eq, inArray } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { categories, inventory, productImages, products } from '@/backend/db/schema';

export async function listProducts({
  page,
  pageSize,
  categoryId,
}: {
  page: number;
  pageSize: number;
  categoryId?: string;
}) {
  const conditions = [eq(products.isActive, true)];

  if (categoryId) {
    // Selecting a parent category (e.g. Building Management Systems) also
    // includes products filed under its subcategories (e.g. Fire Alarm Systems).
    const subcategories = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.parentId, categoryId));
    const categoryIds = [categoryId, ...subcategories.map((c) => c.id)];
    conditions.push(inArray(products.categoryId, categoryIds));
  }

  const where = and(...conditions);
  const [rows, [{ total }]] = await Promise.all([
    db.query.products.findMany({
    where: and(...conditions),
    with: {
      category: true,
      images: true,
    },
    limit: pageSize,
    offset: (page - 1) * pageSize,
    }),
    db.select({ total: count() }).from(products).where(where),
  ]);

  return {
    products: rows.map((product) => ({
      ...product,
      price: Number(product.price),
      rating: Number(product.rating),
      images: product.images.sort((first, second) => first.order - second.order),
    })),
    total: Number(total),
  };
}

export async function findProductById(id: string) {
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.isActive, true)),
    with: {
      category: true,
      images: true,
      // Only ever expose moderated reviews publicly.
      reviews: { where: (review, { eq: whereEq }) => whereEq(review.status, 'approved') },
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
    images: product.images.sort((first, second) => first.order - second.order),
  };
}
export interface ProductInput {
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  categoryId: string;
  sku?: string;
  stock?: number;
  images?: { url: string; alt?: string; order?: number }[];
}

export async function createProduct(input: ProductInput) {
  return db.transaction(async (tx) => {
    const [product] = await tx
      .insert(products)
      .values({
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription,
        price: input.price.toFixed(2),
        categoryId: input.categoryId,
        sku: input.sku,
        stock: input.stock ?? 0,
      })
      .returning();

    if (input.images?.length) {
      await tx.insert(productImages).values(
        input.images.map((img, idx) => ({
          productId: product.id,
          url: img.url,
          alt: img.alt,
          order: img.order ?? idx,
        }))
      );
    }

    await tx.insert(inventory).values({
      productId: product.id,
      quantity: input.stock ?? 0,
    });

    return product;
  });
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const updateValues: Record<string, unknown> = { updatedAt: new Date() };
  if (input.name !== undefined) updateValues.name = input.name;
  if (input.description !== undefined) updateValues.description = input.description;
  if (input.shortDescription !== undefined) updateValues.shortDescription = input.shortDescription;
  if (input.price !== undefined) updateValues.price = input.price.toFixed(2);
  if (input.categoryId !== undefined) updateValues.categoryId = input.categoryId;
  if (input.sku !== undefined) updateValues.sku = input.sku;
  if (input.stock !== undefined) updateValues.stock = input.stock;

  const [updated] = await db.update(products).set(updateValues).where(eq(products.id, id)).returning();
  return updated ?? null;
}

/** Soft delete: keep the row (referenced by orders/reviews) but hide it from the storefront. */
export async function deactivateProduct(id: string) {
  const [updated] = await db
    .update(products)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return updated ?? null;
}
