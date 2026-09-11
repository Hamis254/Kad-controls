/**
 * Product Detail API Route
 * GET    /api/products/:id - get a single product
 * PUT    /api/products/:id - update a product (admin only)
 * DELETE /api/products/:id - deactivate a product (admin only, soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deactivateProduct, findProductById, updateProduct } from '@/backend/products';
import { isAdminRequest } from '@/backend/auth/session';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(10000).optional(),
  shortDescription: z.string().max(500).optional(),
  price: z.number().min(0).optional(),
  categoryId: z.string().uuid().optional(),
  sku: z.string().max(255).optional(),
  stock: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params;

    if (!UUID_RE.test(productId)) {
      return NextResponse.json({ success: false, error: 'Invalid product id' }, { status: 400 });
    }

    const product = await findProductById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = updateProductSchema.parse(await request.json());
    const updated = await updateProduct(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id: updated.id, message: 'Product updated' } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const deactivated = await deactivateProduct(id);

    if (!deactivated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id, message: 'Product deactivated' } });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
