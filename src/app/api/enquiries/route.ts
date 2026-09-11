/**
 * Enquiries API Route
 * GET /api/enquiries - all submitted enquiries (admin only)
 * POST /api/enquiries - submit an enquiry about a product; auto-routes to the
 *   staff assigned to that product's category (falls back to admins), and
 *   emails the sales inbox.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createEnquiry, listAllEnquiries } from '@/backend/queries/enquiries';
import { isAdminRequest } from '@/backend/auth/session';

const submitEnquirySchema = z.object({
  productId: z.string().uuid(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
});

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const enquiries = await listAllEnquiries();
    return NextResponse.json({ success: true, data: { enquiries } });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = submitEnquirySchema.parse(await request.json());

    const enquiry = await createEnquiry({ ...body, userId: null });

    return NextResponse.json(
      { success: true, data: { enquiryId: enquiry.id, message: 'Enquiry submitted successfully' } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
