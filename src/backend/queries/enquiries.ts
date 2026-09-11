import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { categoryAssignments, enquiries, products, users } from '@/backend/db/schema';
import { createNotificationsForUsers } from './notifications';
import { buildEnquiryEmailHtml, sendEmail } from '@/backend/email';

/** Every enquiry is emailed here regardless of category routing — the current single sales contact. */
const SALES_ENQUIRY_EMAIL = process.env.ENQUIRY_NOTIFICATION_EMAIL || 'georgemutinda@saleskadcontrols.co.ke';

/** Staff assigned to a category; falls back to all admins if the category has nobody assigned. */
export async function getStaffForCategory(categoryId: string): Promise<string[]> {
  const assigned = await db
    .select({ staffUserId: categoryAssignments.staffUserId })
    .from(categoryAssignments)
    .where(eq(categoryAssignments.categoryId, categoryId));

  if (assigned.length > 0) {
    return assigned.map((a) => a.staffUserId);
  }

  const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin'));
  return admins.map((a) => a.id);
}

export async function createEnquiry(input: {
  productId: string;
  userId?: string | null;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, input.productId),
  });

  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND');
  }

  const [enquiry] = await db
    .insert(enquiries)
    .values({
      productId: input.productId,
      categoryId: product.categoryId,
      userId: input.userId ?? null,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      status: 'new',
    })
    .returning();

  const staffIds = await getStaffForCategory(product.categoryId);
  await createNotificationsForUsers(staffIds, {
    type: 'new_enquiry',
    title: `New enquiry: ${input.subject}`,
    message: `${input.email} asked about "${product.name}"`,
    relatedEntityId: enquiry.id,
    relatedEntityType: 'enquiry',
  });

  // Best-effort email to the sales inbox — never let an email hiccup fail the enquiry itself.
  try {
    await sendEmail({
      to: SALES_ENQUIRY_EMAIL,
      subject: `Website enquiry: ${input.subject}`,
      html: buildEnquiryEmailHtml({
        productName: product.name,
        subject: input.subject,
        message: input.message,
        customerEmail: input.email,
        customerPhone: input.phone,
      }),
      replyTo: input.email,
    });
  } catch (err) {
    console.error('Failed to email enquiry to sales inbox:', err);
  }

  return enquiry;
}

export async function listEnquiriesForUser(userId: string) {
  return db.query.enquiries.findMany({
    where: eq(enquiries.userId, userId),
    with: { product: true, category: true },
    orderBy: [desc(enquiries.createdAt)],
  });
}

/** All enquiries, newest first — for the admin panel. */
export async function listAllEnquiries() {
  return db.query.enquiries.findMany({
    with: { product: true, category: true },
    orderBy: [desc(enquiries.createdAt)],
  });
}

export async function listEnquiriesForStaff(staffUserId: string, status?: string) {
  const staffCategories = await db
    .select({ categoryId: categoryAssignments.categoryId })
    .from(categoryAssignments)
    .where(eq(categoryAssignments.staffUserId, staffUserId));

  const categoryIds = staffCategories.map((c) => c.categoryId);
  if (categoryIds.length === 0) return [];

  const rows = await db.query.enquiries.findMany({
    with: { product: true, category: true, user: true },
    orderBy: [desc(enquiries.createdAt)],
  });

  return rows.filter((e) => categoryIds.includes(e.categoryId) && (!status || e.status === status));
}
