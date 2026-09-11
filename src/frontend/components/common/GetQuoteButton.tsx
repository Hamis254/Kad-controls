'use client';

import React, { useState } from 'react';
import QuoteRequestModal from './QuoteRequestModal';

interface GetQuoteButtonProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Drop-in replacement for a "Get a Quote" link. Renders as a button (not a link
 * to /contact) and opens QuoteRequestModal, which posts to /api/quote-request —
 * this is a general enquiry, not tied to any single product.
 */
export default function GetQuoteButton({ className, children }: GetQuoteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && <QuoteRequestModal onClose={() => setOpen(false)} />}
    </>
  );
}
