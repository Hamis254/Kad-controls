/**
 * Products API Route
 * GET  /api/products - list products (paginated, optional categoryId filter)
 * POST /api/products - create a product (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createProduct, listProducts } from '@/backend/products';
import { isAdminRequest } from '@/backend/auth/session';

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  shortDescription: z.string().max(500).optional(),
  price: z.number().min(0).optional().default(0),
  categoryId: z.string().uuid(),
  sku: z.string().max(255).optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional(), order: z.number().optional() })).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parsePositiveInteger(searchParams.get('page'), 1);
    const pageSize = Math.min(parsePositiveInteger(searchParams.get('pageSize'), 12), 100);
    const categoryId = searchParams.get('categoryId');

    const result = await listProducts({ page, pageSize, categoryId: categoryId || undefined });

    return NextResponse.json({
      success: true,
      data: {
        products: result.products,
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = createProductSchema.parse(await request.json());
    const product = await createProduct(body);

    return NextResponse.json({ success: true, data: { id: product.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
