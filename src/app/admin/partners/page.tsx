'use client';

import React, { useEffect, useState } from 'react';
import AdminGuard from '@/frontend/components/admin/AdminGuard';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface PartnerItem {
  id: string;
  name: string;
  role: string;
  description?: string | null;
  logoUrl?: string | null;
}

export default function AdminPartnersPage() {
  return (
    <AdminGuard>
      <PartnersAdmin />
    </AdminGuard>
  );
}

function PartnersAdmin() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [form, setForm] = useState({ name: '', role: '', description: '', logoUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => {
    fetch('/api/partners').then((res) => res.json()).then((json) => { if (json.success) setPartners(json.data.partners); }).catch(() => {});
  };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          description: form.description || undefined,
          logoUrl: form.logoUrl || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to add partner');
      setResult({ type: 'success', message: 'Partner added.' });
      setForm({ name: '', role: '', description: '', logoUrl: '' });
      load();
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Failed to add partner' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">Partners</h1>
        <p className="text-muted-foreground mb-8">
          Shown on the public Partners page. Click a partner below to edit it — that&apos;s how to
          add a logo to a partner that&apos;s already there.
        </p>

        {partners.length > 0 && (
          <div className="mb-10 space-y-2">
            {partners.map((p) =>
              editingId === p.id ? (
                <PartnerEditRow key={p.id} partner={p} onDone={() => { setEditingId(null); load(); }} onCancel={() => setEditingId(null)} />
              ) : (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setEditingId(p.id)}
                  className="w-full flex items-center gap-3 border border-border bg-card rounded-lg p-3 text-sm text-left hover:border-primary transition"
                >
                  {p.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logoUrl} alt="" className="h-6 w-6 object-contain shrink-0" />
                  ) : (
                    <span className="h-6 w-6 shrink-0 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                      {p.name.charAt(0)}
                    </span>
                  )}
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground"> — {p.role}</span>
                  <span className="ml-auto text-xs text-primary">Edit →</span>
                </button>
              )
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          <h2 className="font-semibold">Add a new partner</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role (e.g. &quot;Authorized distributor&quot;)</label>
            <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL (optional)</label>
            <input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="Paste a direct image link (right-click a logo → Copy image address)"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          {result && (
            <p className={result.type === 'success' ? 'text-green-600 text-sm' : 'text-destructive text-sm'}>{result.message}</p>
          )}
          <button type="submit" disabled={submitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 disabled:opacity-50">
            {submitting ? 'Saving...' : 'Add partner'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

function PartnerEditRow({ partner, onDone, onCancel }: { partner: PartnerItem; onDone: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: partner.name,
    role: partner.role,
    description: partner.description || '',
    logoUrl: partner.logoUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          description: form.description || undefined,
          logoUrl: form.logoUrl || undefined,
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
        <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          placeholder="Role" className="px-3 py-2 border border-border rounded-lg bg-background text-sm" />
      </div>
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description" rows={2} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" />
      <div className="flex gap-3 items-center">
        <input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
          placeholder="Logo URL" className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm" />
        {form.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.logoUrl} alt="" className="h-10 w-10 object-contain border border-border rounded" />
        )}
      </div>
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
