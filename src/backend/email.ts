/**
 * Minimal transactional email sender using Resend's HTTP API (no SDK dependency —
 * just fetch). Swap providers by rewriting this one function if you'd rather use
 * something else (SMTP, SendGrid, Postmark, etc.) — nothing else in the codebase
 * needs to change.
 *
 * Requires RESEND_API_KEY and a verified sending domain in your Resend account
 * (set EMAIL_FROM to an address on that domain, e.g. enquiries@kadcontrols.co.ke).
 * Until those are set, this logs a warning and no-ops instead of throwing, so a
 * missing email config never breaks enquiry/order submission.
 */

interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      '[email] RESEND_API_KEY or EMAIL_FROM not configured — skipping email send. ' +
        'See .env.example. Subject was: ' + input.subject
    );
    return { sent: false, error: 'EMAIL_NOT_CONFIGURED' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        reply_to: input.replyTo,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[email] Resend API error:', res.status, body);
      return { sent: false, error: `RESEND_ERROR_${res.status}` };
    }

    return { sent: true };
  } catch (error) {
    console.error('[email] Failed to send email:', error);
    return { sent: false, error: 'SEND_FAILED' };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildEnquiryEmailHtml(input: {
  productName: string;
  subject: string;
  message: string;
  customerEmail: string;
  customerPhone?: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin-bottom: 4px;">New product enquiry</h2>
      <p style="color: #555; margin-top: 0;">via the Kad Controls website</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 6px 0; font-weight: bold; width: 120px;">Product</td><td>${escapeHtml(input.productName)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Subject</td><td>${escapeHtml(input.subject)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">From</td><td>${escapeHtml(input.customerEmail)}</td></tr>
        ${input.customerPhone ? `<tr><td style="padding: 6px 0; font-weight: bold;">Phone</td><td>${escapeHtml(input.customerPhone)}</td></tr>` : ''}
      </table>
      <p style="font-weight: bold; margin-top: 20px; margin-bottom: 4px;">Message</p>
      <p style="white-space: pre-wrap; border-left: 3px solid #ccc; padding-left: 12px;">${escapeHtml(input.message)}</p>
    </div>
  `;
}

/** General (non-product) quote request — from the "Get a Quote" CTAs on About/What We Do. */
export function buildGeneralQuoteEmailHtml(input: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin-bottom: 4px;">New quote request</h2>
      <p style="color: #555; margin-top: 0;">via the Kad Controls website</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 6px 0; font-weight: bold; width: 120px;">Name</td><td>${escapeHtml(input.name)}</td></tr>
        ${input.company ? `<tr><td style="padding: 6px 0; font-weight: bold;">Company</td><td>${escapeHtml(input.company)}</td></tr>` : ''}
        <tr><td style="padding: 6px 0; font-weight: bold;">Email</td><td>${escapeHtml(input.email)}</td></tr>
        ${input.phone ? `<tr><td style="padding: 6px 0; font-weight: bold;">Phone</td><td>${escapeHtml(input.phone)}</td></tr>` : ''}
      </table>
      <p style="font-weight: bold; margin-top: 20px; margin-bottom: 4px;">Message</p>
      <p style="white-space: pre-wrap; border-left: 3px solid #ccc; padding-left: 12px;">${escapeHtml(input.message)}</p>
    </div>
  `;
}
