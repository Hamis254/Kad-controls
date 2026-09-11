'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error || 'Incorrect password');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong — try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-card border border-border rounded-lg p-8 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Kad Controls Ltd — internal use only</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
          />
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full px-6 py-3 bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
