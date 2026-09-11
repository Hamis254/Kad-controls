'use client';

import React, { useEffect, useState } from 'react';
import AdminGuard from '@/frontend/components/admin/AdminGuard';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface ClientItem {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export default function AdminClientsPage() {
  return (
    <AdminGuard>
      <ClientsAdmin />
    </AdminGuard>
  );
}

function ClientsAdmin() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [form, setForm] = useState({ name: '', logoUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const load = () => {
    fetch('/api/clients').then((res) => res.json()).then((json) => { if (json.success) setClients(json.data.clients); }).catch(() => {});
  };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, logoUrl: form.logoUrl || undefined }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to add client');
      setResult({ type: 'success', message: 'Client added.' });
      setForm({ name: '', logoUrl: '' });
      load();
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Failed to add client' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">Served Clients</h1>
        <p className="text-muted-foreground mb-8">Shown as the &quot;Our Clients&quot; strip on the home page.</p>

        {clients.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {clients.map((c) => (
              <span key={c.id} className="border border-border bg-card rounded-lg px-3 py-1.5 text-sm">{c.name}</span>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Client name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL (optional)</label>
            <input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          {result && (
            <p className={result.type === 'success' ? 'text-green-600 text-sm' : 'text-destructive text-sm'}>{result.message}</p>
          )}
          <button type="submit" disabled={submitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 disabled:opacity-50">
            {submitting ? 'Saving...' : 'Add client'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
