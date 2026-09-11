'use client';

import React, { useEffect, useState } from 'react';
import AdminGuard from '@/frontend/components/admin/AdminGuard';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface CategoryItem {
  id: string;
  name: string;
  parentId?: string | null;
}

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <CategoriesAdmin />
    </AdminGuard>
  );
}

function CategoriesAdmin() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [form, setForm] = useState({ name: '', description: '', parentId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const load = () => {
    fetch('/api/categories').then((res) => res.json()).then((json) => { if (json.success) setCategories(json.data.categories); }).catch(() => {});
  };
  useEffect(load, []);

  const topLevel = categories.filter((c) => !c.parentId);
  const childrenOf = (id: string) => categories.filter((c) => c.parentId === id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          parentId: form.parentId || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to create category');
      setResult({ type: 'success', message: 'Category created.' });
      setForm({ name: '', description: '', parentId: '' });
      load();
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create category' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground mb-8">
          Used to organize the catalogue. A category can optionally sit under a parent
          (e.g. &quot;Fire Alarm Systems&quot; under &quot;Building Management Systems&quot;).
        </p>

        {topLevel.length > 0 && (
          <div className="mb-10 space-y-2">
            {topLevel.map((cat) => (
              <div key={cat.id}>
                <div className="border border-border bg-card rounded-lg p-3 text-sm font-medium">{cat.name}</div>
                {childrenOf(cat.id).map((child) => (
                  <div key={child.id} className="ml-6 mt-2 border border-border bg-card rounded-lg p-3 text-sm text-muted-foreground">
                    ↳ {child.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parent category (optional)</label>
            <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background">
              <option value="">— None (top-level) —</option>
              {topLevel.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {result && (
            <p className={result.type === 'success' ? 'text-green-600 text-sm' : 'text-destructive text-sm'}>{result.message}</p>
          )}
          <button type="submit" disabled={submitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 disabled:opacity-50">
            {submitting ? 'Saving...' : 'Add category'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
