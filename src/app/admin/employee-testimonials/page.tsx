'use client';

import React, { useEffect, useState } from 'react';
import AdminGuard from '@/frontend/components/admin/AdminGuard';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface EmployeeTestimonialItem {
  id: string;
  name: string;
  position: string;
  photoUrl?: string | null;
  testimonial: string;
}

export default function AdminEmployeeTestimonialsPage() {
  return (
    <AdminGuard>
      <EmployeeTestimonialsAdmin />
    </AdminGuard>
  );
}

function EmployeeTestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<EmployeeTestimonialItem[]>([]);
  const [form, setForm] = useState({ name: '', position: '', photoUrl: '', testimonial: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => {
    fetch('/api/employee-testimonials')
      .then((res) => res.json())
      .then((json) => { if (json.success) setTestimonials(json.data.testimonials); })
      .catch(() => {});
  };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/employee-testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          position: form.position,
          photoUrl: form.photoUrl || undefined,
          testimonial: form.testimonial,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to add testimonial');
      setResult({ type: 'success', message: 'Testimonial added.' });
      setForm({ name: '', position: '', photoUrl: '', testimonial: '' });
      load();
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Failed to add testimonial' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">Employee testimonials</h1>
        <p className="text-muted-foreground mb-8">
          Shown on the public Careers page. Click a testimonial below to edit it.
        </p>

        {testimonials.length > 0 && (
          <div className="mb-10 space-y-2">
            {testimonials.map((testimonial) =>
              editingId === testimonial.id ? (
                <EmployeeTestimonialEditRow
                  key={testimonial.id}
                  testimonial={testimonial}
                  onDone={() => { setEditingId(null); load(); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <button
                  key={testimonial.id}
                  type="button"
                  onClick={() => setEditingId(testimonial.id)}
                  className="w-full flex items-center gap-3 border border-border bg-card rounded-lg p-3 text-sm text-left hover:border-primary transition"
                >
                  {testimonial.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={testimonial.photoUrl} alt="" className="h-8 w-8 object-cover rounded-full shrink-0" />
                  ) : (
                    <span className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      {testimonial.name.charAt(0)}
                    </span>
                  )}
                  <span className="font-medium">{testimonial.name}</span>
                  <span className="text-muted-foreground"> — {testimonial.position}</span>
                  <span className="ml-auto text-xs text-primary">Edit →</span>
                </button>
              )
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          <h2 className="font-semibold">Add a new testimonial</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder="e.g. Sales Executive"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo URL (optional)</label>
            <input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Testimonial</label>
            <textarea required value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
              rows={5} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          {result && (
            <p className={result.type === 'success' ? 'text-green-600 text-sm' : 'text-destructive text-sm'}>{result.message}</p>
          )}
          <button type="submit" disabled={submitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 disabled:opacity-50">
            {submitting ? 'Saving...' : 'Add testimonial'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

function EmployeeTestimonialEditRow({ testimonial, onDone, onCancel }: {
  testimonial: EmployeeTestimonialItem;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: testimonial.name,
    position: testimonial.position,
    photoUrl: testimonial.photoUrl || '',
    testimonial: testimonial.testimonial,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/employee-testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          position: form.position,
          photoUrl: form.photoUrl || undefined,
          testimonial: form.testimonial,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-primary bg-card rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name" className="px-3 py-2 border border-border rounded-lg bg-background text-sm" />
        <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
          placeholder="Position" className="px-3 py-2 border border-border rounded-lg bg-background text-sm" />
      </div>
      <input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
        placeholder="Photo URL" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
      <textarea value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
        placeholder="Testimonial" rows={4} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={handleSave} disabled={saving}
          className="rounded-full px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-full px-4 py-1.5 border border-black text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition">
          Cancel
        </button>
      </div>
    </div>
  );
}
