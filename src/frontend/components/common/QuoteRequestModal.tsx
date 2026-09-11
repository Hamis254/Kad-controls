'use client';

import React, { useState } from 'react';

interface QuoteRequestModalProps {
  onClose: () => void;
}

export default function QuoteRequestModal({ onClose }: QuoteRequestModalProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send quote request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 border border-border" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <>
            <h3 className="text-xl font-bold mb-2">Request sent</h3>
            <p className="text-muted-foreground mb-4">We&apos;ll get back to you with a quote shortly.</p>
            <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-full">
              Close
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold">Request a quote</h3>
            <p className="text-sm text-muted-foreground -mt-2">Tell us what you need and we&apos;ll get back to you.</p>
            <input
              required
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
            <input
              required
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
            <textarea
              required
              placeholder="What do you need a quote for?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              rows={4}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-full disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send request'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-black rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
