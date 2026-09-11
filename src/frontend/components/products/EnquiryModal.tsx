'use client';

import React, { useState } from 'react';

interface EnquiryModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function EnquiryModal({ productId, productName, onClose }: EnquiryModalProps) {
  const [form, setForm] = useState({ subject: `Enquiry: ${productName}`, message: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...form }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 border border-border">
        {done ? (
          <>
            <h3 className="text-xl font-bold mb-2">Enquiry sent</h3>
            <p className="text-muted-foreground mb-4">
              Thanks — our sales team has received your enquiry about <strong>{productName}</strong> and will get back to you shortly.
            </p>
            <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-full">Close</button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">Send an enquiry</h3>
              <p className="text-sm text-muted-foreground mt-1">About: {productName}</p>
            </div>
            <input required type="text" placeholder="Subject" value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            <textarea required placeholder="Tell us what you need (quantity, specs, timeline, etc.)" value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" rows={4} />
            <input required type="email" placeholder="Your email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            <input type="tel" placeholder="Phone (optional)" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-full disabled:opacity-50">
                {submitting ? 'Sending...' : 'Submit Enquiry'}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2 border border-black rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
