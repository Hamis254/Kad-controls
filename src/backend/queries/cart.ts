import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/backend/db/client';
import { cartItems, carts, products } from '@/backend/db/schema';

type CartOwner = { userId: string } | { sessionId: string };

async function getOrCreateCart(owner: CartOwner) {
  const where =
    'userId' in owner
      ? eq(carts.userId, owner.userId)
      : and(eq(carts.sessionId, owner.sessionId), isNull(carts.userId));

  const existing = await db.query.carts.findFirst({ where });
  if (existing) return existing;

  const [created] = await db
    .insert(carts)
    .values('userId' in owner ? { userId: owner.userId } : { sessionId: owner.sessionId })
    .returning();
  return created;
}

export async function getCartWithItems(owner: CartOwner) {
  const cart = await getOrCreateCart(owner);

  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cart.id),
    with: { product: { with: { images: true } } },
  });

  const normalized = items.map((item) => ({
    ...item,
    priceAtAdd: Number(item.priceAtAdd),
    product: item.product
      ? { ...item.product, price: Number(item.product.price), rating: Number(item.product.rating) }
      : undefined,
  }));

  const totalItems = normalized.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = normalized.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

  return { cart, items: normalized, totalItems, totalPrice };
}

export async function addItemToCart(owner: CartOwner, productId: string, quantity: number) {
  if (quantity <= 0) throw new Error('INVALID_QUANTITY');

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.isActive, true)),
  });
  if (!product) throw new Error('PRODUCT_NOT_FOUND');

  const cart = await getOrCreateCart(owner);

  const existingItem = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
  });

  const desiredQuantity = (existingItem?.quantity ?? 0) + quantity;
  if (desiredQuantity > product.stock) {
    throw new Error('INSUFFICIENT_STOCK');
  }

  if (existingItem) {
    await db
      .update(cartItems)
      .set({ quantity: desiredQuantity, priceAtAdd: product.price })
      .where(eq(cartItems.id, existingItem.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      productId,
      quantity,
      priceAtAdd: product.price,
    });
  }

  return getCartWithItems(owner);
}

export async function updateCartItemQuantity(owner: CartOwner, productId: string, quantity: number) {
  const cart = await getOrCreateCart(owner);

  if (quantity <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)));
    return getCartWithItems(owner);
  }

  const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
  if (!product) throw new Error('PRODUCT_NOT_FOUND');
  if (quantity > product.stock) throw new Error('INSUFFICIENT_STOCK');

  await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)));

  return getCartWithItems(owner);
}

export async function removeItemFromCart(owner: CartOwner, productId: string) {
  const cart = await getOrCreateCart(owner);
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)));
  return getCartWithItems(owner);
}

export async function clearCart(owner: CartOwner) {
  const cart = await getOrCreateCart(owner);
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
}

/**
 * Called right after a guest logs in: folds their sessionId-keyed cart into their
 * userId-keyed cart (summing quantities, capped to stock), then deletes the guest cart.
 */
export async function mergeGuestCartIntoUser(sessionId: string, userId: string) {
  const guestCart = await db.query.carts.findFirst({
    where: and(eq(carts.sessionId, sessionId), isNull(carts.userId)),
  });
  if (!guestCart) return;

  const guestItems = await db.query.cartItems.findMany({ where: eq(cartItems.cartId, guestCart.id) });

  for (const item of guestItems) {
    try {
      await addItemToCart({ userId }, item.productId, item.quantity);
    } catch {
      // Skip items that are now out of stock or invalid rather than failing the whole login.
    }
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
  await db.delete(carts).where(eq(carts.id, guestCart.id));
}
