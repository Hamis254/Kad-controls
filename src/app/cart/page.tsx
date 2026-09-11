'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';
import { useCart } from '@/frontend/context/CartContext';

const SALES_EMAIL = 'georgemutinda@saleskadcontrols.co.ke';

function buildRfqMailto(
  items: { productId: string; quantity: number; product?: { name: string; sku?: string } }[],
  requester: { name: string; email: string; phone: string; company: string; notes: string }
) {
  const lines = items.map(
    (item, idx) => `${idx + 1}. ${item.product?.name ?? 'Product'}${item.product?.sku ? ` (SKU: ${item.product.sku})` : ''} — Qty: ${item.quantity}`
  );

  const body = [
    `Hello Kad Controls,`,
    ``,
    `I would like to request a quotation for the following items:`,
    ``,
    ...lines,
    ``,
    `My details:`,
    `Name: ${requester.name}`,
    `Company: ${requester.company || '-'}`,
    `Email: ${requester.email}`,
    `Phone: ${requester.phone || '-'}`,
    ``,
    requester.notes ? `Additional notes:\n${requester.notes}` : '',
  ].join('\n');

  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent('Request for Quotation (RFQ)')}&body=${encodeURIComponent(body)}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, isLoading } = useCart();
  const [requester, setRequester] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });
  const [sent, setSent] = useState(false);

  const handleRequestQuotation = () => {
    const mailto = buildRfqMailto(items, requester);
    window.location.href = mailto;
    setSent(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your Quote List is Empty</h1>
            <p className="text-muted-foreground mb-6">Browse the catalogue and add products you&apos;d like a quotation for.</p>
            <Link href="/catalogue" className="inline-block rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold">
              Browse Catalogue
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <h1 className="text-4xl font-bold mb-2">Your Quote List</h1>
        <p className="text-muted-foreground mb-8">
          No prices are shown on this site — add the products you need below, then request a quotation
          and our team will get back to you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-lg shadow-sm border border-border p-4 flex gap-4 items-center">
                <img
                  src={item.product?.images?.[0]?.url || '/placeholder-product.svg'}
                  alt={item.product?.name || ''}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.productId}`} className="font-semibold hover:text-primary line-clamp-1">
                    {item.product?.name}
                  </Link>
                  {item.product?.sku && <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>}
                </div>
                <div className="flex items-center border border-border rounded-lg shrink-0">
                  <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="px-3 py-1 hover:bg-muted">−</button>
                  <span className="px-4 py-1 border-l border-r border-border">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1 hover:bg-muted">+</button>
                </div>
                <button onClick={() => removeItem(item.productId)} className="text-destructive text-sm shrink-0">Remove</button>
              </div>
            ))}
          </div>

          {/* RFQ form */}
          <aside>
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 sticky top-20 space-y-4">
              <h3 className="text-lg font-bold">Request a Quotation</h3>
              <p className="text-sm text-muted-foreground">
                This opens your email app with the request pre-filled, addressed to our sales team.
              </p>

              <input placeholder="Your name" value={requester.name} onChange={(e) => setRequester({ ...requester, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
              <input placeholder="Company (optional)" value={requester.company} onChange={(e) => setRequester({ ...requester, company: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
              <input type="email" placeholder="Your email" value={requester.email} onChange={(e) => setRequester({ ...requester, email: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
              <input type="tel" placeholder="Phone (optional)" value={requester.phone} onChange={(e) => setRequester({ ...requester, phone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
              <textarea placeholder="Additional notes (optional)" value={requester.notes} onChange={(e) => setRequester({ ...requester, notes: e.target.value })}
                rows={3} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />

              <button
                onClick={handleRequestQuotation}
                disabled={!requester.name || !requester.email}
                className="w-full rounded-full px-6 py-3 bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Request Quotation via Email
              </button>

              {sent && (
                <p className="text-sm text-green-600">
                  Your email app should have opened with the request ready to send. If nothing opened,
                  email us directly at <a href={`mailto:${SALES_EMAIL}`} className="underline">{SALES_EMAIL}</a>.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
