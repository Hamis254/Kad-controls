/**
 * Reviews API Route
 * GET /api/reviews?productId=...&page=1 - approved reviews for a product
 *
 * There's no POST here: submitting a review used to require a signed-in
 * customer with a completed order, but there are no customer accounts anymore
 * (no Google sign-in) and no online checkout (replaced by the RFQ-via-email
 * flow). Reviews are read-only for now — a future admin-entry feature would be
 * the natural way to add testimonials/reviews going forward.
 */

import { NextRequest, NextResponse } from 'next/server';
import { listReviewsForProduct } from '@/backend/queries/reviews';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = 10;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId is required' }, { status: 400 });
    }

    const { reviews, total } = await listReviewsForProduct(productId, page, pageSize);

    return NextResponse.json({
      success: true,
      data: { reviews, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
