import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { addresses, orderItems, orders, products, users } from '@/backend/db/schema';
import { createNotificationsForUsers } from './notifications';

export async function listOrdersForUser(userId: string) {
  return db.query.orders.findMany({
    where: eq(orders.userId, userId),
    with: { items: { with: { product: true } } },
    orderBy: [desc(orders.createdAt)],
  });
}

export async function findOrderById(orderId: string, userId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: { with: { product: true } } },
  }).then((order) => (order && order.userId === userId ? order : null));
}

export interface CreateOrderInput {
  userId: string;
  cartItems: { productId: string; quantity: number; priceAtAdd: number }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
}

/**
 * Places an order atomically: re-validates stock against the DB (never trusts the
 * client's cached prices/quantities), decrements inventory, records the order, saves
 * the shipping address, and notifies admins. Throws INSUFFICIENT_STOCK if anything
 * changed since the item was added to the cart.
 */
export async function createOrderFromCart(input: CreateOrderInput) {
  if (input.cartItems.length === 0) {
    throw new Error('EMPTY_CART');
  }

  return db.transaction(async (tx) => {
    let totalAmount = 0;
    const validatedItems: { productId: string; quantity: number; price: number; subtotal: number }[] = [];

    for (const line of input.cartItems) {
      const [product] = await tx
        .select()
        .from(products)
        .where(eq(products.id, line.productId))
        .for('update'); // lock the row so concurrent checkouts can't oversell

      if (!product || !product.isActive) {
        throw new Error(`PRODUCT_UNAVAILABLE:${line.productId}`);
      }
      if (product.stock < line.quantity) {
        throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
      }

      const price = Number(product.price);
      const subtotal = price * line.quantity;
      totalAmount += subtotal;
      validatedItems.push({ productId: product.id, quantity: line.quantity, price, subtotal });

      await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${line.quantity}` })
        .where(eq(products.id, product.id));
    }

    const [order] = await tx
      .insert(orders)
      .values({
        userId: input.userId,
        status: 'pending',
        totalAmount: totalAmount.toFixed(2),
        paymentStatus: 'pending',
        paymentMethod: input.paymentMethod,
      })
      .returning();

    await tx.insert(orderItems).values(
      validatedItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.price.toFixed(2),
        subtotal: item.subtotal.toFixed(2),
      }))
    );

    await tx.insert(addresses).values({
      userId: input.userId,
      firstName: input.shippingAddress.firstName,
      lastName: input.shippingAddress.lastName,
      email: input.shippingAddress.email,
      phone: input.shippingAddress.phone,
      street: input.shippingAddress.street,
      city: input.shippingAddress.city,
      state: input.shippingAddress.state,
      postalCode: input.shippingAddress.postalCode,
      country: input.shippingAddress.country,
      type: 'shipping',
    });

    return order;
  }).then(async (order) => {
    // Notifications are best-effort; a failure here shouldn't fail an already-placed order.
    try {
      const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin'));
      await createNotificationsForUsers(
        admins.map((a) => a.id),
        {
          type: 'new_order',
          title: `New order placed`,
          message: `Order ${order.id} for $${order.totalAmount}`,
          relatedEntityId: order.id,
          relatedEntityType: 'order',
        }
      );
      await createNotificationsForUsers([order.userId], {
        type: 'order_confirmed',
        title: 'Order confirmed',
        message: `Your order for $${order.totalAmount} has been received.`,
        relatedEntityId: order.id,
        relatedEntityType: 'order',
      });
    } catch (err) {
      console.error('Failed to create order notifications:', err);
    }
    return order;
  });
}
