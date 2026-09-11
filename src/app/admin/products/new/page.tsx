'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';
import AdminGuard from '@/frontend/components/admin/AdminGuard';
import { Category } from '@/frontend/types';

interface ImageField {
  url: string;
  alt: string;
}

/**
 * Minimal admin product form. There's no staff dashboard yet (that's Phase 2 —
 * see the roadmap), so this is a bare-bones, admin-gated page that lets you get
 * real products with real photos into the catalogue right now. Photos are added
 * by URL (paste a hosted image link) since no file-upload/storage provider is
 * wired up yet — see the note at the bottom of the page.
 */
export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    categoryId: '',
    sku: '',
    stock: '0',
  });
  const [images, setImages] = useState<ImageField[]>([{ url: '', alt: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((json) => { if (json.success) setCategories(json.data.categories); })
      .catch(() => {});
  }, []);

  return (
    <AdminGuard>
      <NewProductForm
        categories={categories}
        form={form}
        setForm={setForm}
        images={images}
        setImages={setImages}
        submitting={submitting}
        setSubmitting={setSubmitting}
        result={result}
        setResult={setResult}
      />
    </AdminGuard>
  );
}

interface FormState {
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  categoryId: string;
  sku: string;
  stock: string;
}

function NewProductForm({
  categories,
  form,
  setForm,
  images,
  setImages,
  submitting,
  setSubmitting,
  result,
  setResult,
}: {
  categories: Category[];
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  images: ImageField[];
  setImages: React.Dispatch<React.SetStateAction<ImageField[]>>;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  result: { type: 'success' | 'error'; message: string } | null;
  setResult: (v: { type: 'success' | 'error'; message: string } | null) => void;
}) {

  const updateImage = (idx: number, field: keyof ImageField, value: string) => {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, [field]: value } : img)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const payload = {
        name: form.name,
        shortDescription: form.shortDescription || undefined,
        description: form.description || undefined,
        price: form.price ? parseFloat(form.price) : 0,
        categoryId: form.categoryId,
        sku: form.sku || undefined,
        stock: parseInt(form.stock, 10) || 0,
        images: images
          .filter((img) => img.url.trim())
          .map((img, idx) => ({ url: img.url.trim(), alt: img.alt || form.name, order: idx })),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Failed to create product');

      setResult({ type: 'success', message: 'Product created.' });
      setForm({ name: '', shortDescription: '', description: '', price: '', categoryId: '', sku: '', stock: '0' });
      setImages([{ url: '', alt: '' }]);
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create product' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">Add a product</h1>
        <p className="text-muted-foreground mb-8">Visible immediately in the public catalogue once saved.</p>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short description</label>
            <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              maxLength={500} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Internal reference price (optional)</label>
              <input type="number" step="0.01" min="0" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Not shown on the public site"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground -mt-3">
            Pricing is never shown publicly — visitors send an enquiry or request a quotation instead.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                <option value="">Select...</option>
                {categories
                  .filter((c) => !c.parentId)
                  .flatMap((parent) => [
                    <option key={parent.id} value={parent.id}>{parent.name}</option>,
                    ...categories
                      .filter((c) => c.parentId === parent.id)
                      .map((child) => <option key={child.id} value={child.id}>{'\u00A0\u00A0↳ '}{child.name}</option>),
                  ])}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photos (image URLs)</label>
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      placeholder="https://... (hosted photo URL)"
                      value={img.url}
                      onChange={(e) => updateImage(idx, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    />
                    <input
                      placeholder="Alt text (optional)"
                      value={img.alt}
                      onChange={(e) => updateImage(idx, 'alt', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    />
                  </div>
                  {img.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt="" className="w-16 h-16 object-cover rounded-lg border border-border" />
                  )}
                  {images.length > 1 && (
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-destructive text-sm px-2 py-2">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setImages((prev) => [...prev, { url: '', alt: '' }])}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              + Add another photo
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Paste a direct image link (e.g. from Google Drive/Imgur/your own hosting). Real file upload
              from your device isn&apos;t wired up yet — see notes below.
            </p>
          </div>

          {result && (
            <p className={result.type === 'success' ? 'text-green-600 text-sm' : 'text-destructive text-sm'}>
              {result.message}
            </p>
          )}

          <button type="submit" disabled={submitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 disabled:opacity-50">
            {submitting ? 'Saving...' : 'Create product'}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
