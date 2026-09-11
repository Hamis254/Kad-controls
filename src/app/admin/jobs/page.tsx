'use client';

import React, { useEffect, useState } from 'react';
import AdminGuard from '@/frontend/components/admin/AdminGuard';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface JobItem {
  id: string;
  title: string;
  department?: string | null;
  location?: string | null;
  isOpen: boolean;
}

export default function AdminJobsPage() {
  return (
    <AdminGuard>
      <JobsAdmin />
    </AdminGuard>
  );
}

function JobsAdmin() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'full_time',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const load = () => {
    fetch('/api/jobs?all=true').then((res) => res.json()).then((json) => { if (json.success) setJobs(json.data.jobs); }).catch(() => {});
  };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          department: form.department || undefined,
          location: form.location || undefined,
          employmentType: form.employmentType,
          description: form.description,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to post job');
      setResult({ type: 'success', message: 'Job posted.' });
      setForm({ title: '', department: '', location: '', employmentType: 'full_time', description: '' });
      load();
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Failed to post job' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">Careers</h1>
        <p className="text-muted-foreground mb-8">Open postings show on the public Careers page.</p>

        {jobs.length > 0 && (
          <div className="mb-10 space-y-2">
            {jobs.map((j) => (
              <div key={j.id} className="border border-border bg-card rounded-lg p-3 text-sm flex justify-between">
                <span>
                  <span className="font-medium">{j.title}</span>
                  {j.location && <span className="text-muted-foreground"> — {j.location}</span>}
                </span>
                <span className={j.isOpen ? 'text-green-600' : 'text-muted-foreground'}>{j.isOpen ? 'Open' : 'Closed'}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Job title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department (optional)</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location (optional)</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employment type</label>
            <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background">
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          {result && (
            <p className={result.type === 'success' ? 'text-green-600 text-sm' : 'text-destructive text-sm'}>{result.message}</p>
          )}
          <button type="submit" disabled={submitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 disabled:opacity-50">
            {submitting ? 'Posting...' : 'Post job'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
