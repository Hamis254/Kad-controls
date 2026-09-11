import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { notifications } from '@/backend/db/schema';

type NotificationType =
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'review_request'
  | 'stock_available'
  | 'enquiry_response'
  | 'new_enquiry'
  | 'new_order'
  | 'low_stock';

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}) {
  const [created] = await db.insert(notifications).values(input).returning();
  return created;
}

export async function createNotificationsForUsers(
  userIds: string[],
  input: Omit<Parameters<typeof createNotification>[0], 'userId'>
) {
  if (userIds.length === 0) return [];
  return db
    .insert(notifications)
    .values(userIds.map((userId) => ({ ...input, userId })))
    .returning();
}

export async function listNotificationsForUser(userId: string, unreadOnly = false) {
  return db.query.notifications.findMany({
    where: unreadOnly
      ? and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      : eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit: 50,
  });
}

export async function markNotificationRead(id: string, userId: string) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
}
