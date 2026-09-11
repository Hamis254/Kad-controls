/**
 * General Quote Request API Route
 * POST /api/quote-request - submit a quote request not tied to a specific product
 * (used by the "Get a Quote" CTAs on About Us / What We Do). Emails the sales
 * inbox directly — no cart/product context required.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildGeneralQuoteEmailHtml, sendEmail } from '@/backend/email';

const SALES_EMAIL = process.env.ENQUIRY_NOTIFICATION_EMAIL || 'georgemutinda@saleskadcontrols.co.ke';

const quoteRequestSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  company: z.string().max(255).optional(),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = quoteRequestSchema.parse(await request.json());

    try {
      await sendEmail({
        to: SALES_EMAIL,
        subject: `Website quote request from ${body.name}`,
        html: buildGeneralQuoteEmailHtml(body),
        replyTo: body.email,
      });
    } catch (err) {
      console.error('Failed to email quote request to sales inbox:', err);
    }

    return NextResponse.json(
      { success: true, data: { message: 'Quote request submitted successfully' } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error submitting quote request:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit quote request' }, { status: 500 });
  }
}
