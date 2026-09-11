/**
 * Cart API Route — server-persisted cart, keyed by the signed-in user or, for
 * guests, by an httpOnly anonymous cart-session cookie (see backend/auth/session.ts).
 *
 * GET    /api/cart              - current cart
 * POST   /api/cart               - add an item { productId, quantity }
 * PATCH  /api/cart               - set an item's quantity { productId, quantity } (0 removes it)
 * DELETE /api/cart?productId=... - remove an item, or clear the whole cart if no productId
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  addItemToCart,
  clearCart,
  getCartWithItems,
  removeItemFromCart,
  updateCartItemQuantity,
} from '@/backend/queries/cart';
import { getOrCreateCartSid } from '@/backend/auth/session';

const itemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(0).max(999),
});

// No customer accounts — every quote list is identified by the anonymous cart-session cookie.
function resolveOwner(request: NextRequest, response: NextResponse) {
  return { sessionId: getOrCreateCartSid(request, response) };
}

function errorStatus(message: string) {
  if (message === 'PRODUCT_NOT_FOUND') return { status: 404, error: 'Product not found' };
  if (message === 'INSUFFICIENT_STOCK') return { status: 409, error: 'Not enough stock available' };
  if (message === 'INVALID_QUANTITY') return { status: 400, error: 'Quantity must be greater than zero' };
  return { status: 500, error: 'Cart operation failed' };
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  try {
    const owner = resolveOwner(request, response);
    const result = await getCartWithItems(owner);
    return NextResponse.json({ success: true, data: result }, { headers: response.headers });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  try {
    const owner = resolveOwner(request, response);
    const { productId, quantity } = itemSchema.parse(await request.json());
    const result = await addItemToCart(owner, productId, quantity || 1);
    return NextResponse.json({ success: true, data: result }, { headers: response.headers });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    const { status, error: message } = errorStatus(error instanceof Error ? error.message : '');
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  try {
    const owner = resolveOwner(request, response);
    const { productId, quantity } = itemSchema.parse(await request.json());
    const result = await updateCartItemQuantity(owner, productId, quantity);
    return NextResponse.json({ success: true, data: result }, { headers: response.headers });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    const { status, error: message } = errorStatus(error instanceof Error ? error.message : '');
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  try {
    const owner = resolveOwner(request, response);
    const productId = request.nextUrl.searchParams.get('productId');

    if (productId) {
      const result = await removeItemFromCart(owner, productId);
      return NextResponse.json({ success: true, data: result }, { headers: response.headers });
    }

    await clearCart(owner);
    return NextResponse.json({ success: true }, { headers: response.headers });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ success: false, error: 'Cart operation failed' }, { status: 500 });
  }
}
