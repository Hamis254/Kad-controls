import { and, avg, count, desc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { orderItems, orders, products, reviews } from '@/backend/db/schema';

export async function listReviewsForProduct(productId: string, page: number, pageSize: number) {
  const where = and(eq(reviews.productId, productId), eq(reviews.status, 'approved'));

  const [rows, [{ total }]] = await Promise.all([
    db.query.reviews.findMany({
      where,
      with: { user: true },
      orderBy: [desc(reviews.createdAt)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    db.select({ total: count() }).from(reviews).where(where),
  ]);

  return {
    reviews: rows.map((r) => ({
      ...r,
      user: r.user ? { id: r.user.id, name: r.user.name } : null,
    })),
    total: Number(total),
  };
}

/** A user may only review a product they've actually received an order for (verified purchase). */
export async function hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orderItems.productId, productId),
        eq(orders.status, 'completed')
      )
    )
    .limit(1);
  return !!row;
}

export async function hasUserAlreadyReviewed(userId: string, productId: string): Promise<boolean> {
  const existing = await db.query.reviews.findFirst({
    where: and(eq(reviews.userId, userId), eq(reviews.productId, productId)),
  });
  return !!existing;
}

export async function createReview(input: {
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
}) {
  const [created] = await db
    .insert(reviews)
    .values({
      productId: input.productId,
      userId: input.userId,
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      status: 'pending', // moderated before it becomes publicly visible
    })
    .returning();

  return created;
}

/** Recomputes and stores the product's aggregate rating/reviewCount from approved reviews. */
export async function recalculateProductRating(productId: string) {
  const [agg] = await db
    .select({ avgRating: avg(reviews.rating), reviewCount: count() })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved')));

  await db
    .update(products)
    .set({
      rating: agg?.avgRating ? Number(agg.avgRating).toFixed(2) : '0',
      reviewCount: Number(agg?.reviewCount ?? 0),
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));
}
