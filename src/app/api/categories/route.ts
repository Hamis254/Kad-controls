/**
 * Categories API Route
 * GET /api/categories - list categories. Add ?tree=true for top-level categories
 *   with their subcategories nested (used by the home page / catalogue sidebar).
 * POST /api/categories - create a category, optionally under a parent (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCategory, listCategories, listCategoriesTree } from '@/backend/queries/categories';
import { isAdminRequest } from '@/backend/auth/session';

const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const tree = request.nextUrl.searchParams.get('tree') === 'true';
    if (tree) {
      const categories = await listCategoriesTree();
      return NextResponse.json({ success: true, data: { categories } });
    }
    const categories = await listCategories();
    return NextResponse.json({ success: true, data: { categories } });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = createCategorySchema.parse(await request.json());
    const category = await createCategory(body);

    return NextResponse.json({ success: true, data: { category } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
