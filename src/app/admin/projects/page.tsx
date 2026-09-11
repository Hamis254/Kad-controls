'use client';

import React, { useEffect, useState } from 'react';
import AdminGuard from '@/frontend/components/admin/AdminGuard';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface MediaField {
  type: 'image' | 'video';
  url: string;
  caption: string;
}

interface ProjectListItem {
  id: string;
  title: string;
  clientName?: string | null;
  summary?: string | null;
  createdAt: string;
}

export default function AdminProjectsPage() {
  return (
    <AdminGuard>
      <ProjectsAdmin />
    </AdminGuard>
  );
}

function ProjectsAdmin() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [form, setForm] = useState({ title: '', clientName: '', summary: '', description: '' });
  const [media, setMedia] = useState<MediaField[]>([{ type: 'image', url: '', caption: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadProjects = () => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((json) => { if (json.success) setProjects(json.data.projects); })
      .catch(() => {});
  };

  useEffect(() => { loadProjects(); }, []);

  const updateMedia = (idx: number, field: keyof MediaField, value: string) => {
    setMedia((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const payload = {
        title: form.title,
        clientName: form.clientName || undefined,
        summary: form.summary || undefined,
        description: form.description || undefined,
        media: media
          .filter((m) => m.url.trim())
          .map((m, idx) => ({ type: m.type, url: m.url.trim(), caption: m.caption || undefined, order: idx })),
      };
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to create project');

      setResult({ type: 'success', message: 'Project published.' });
      setForm({ title: '', clientName: '', summary: '', description: '' });
      setMedia([{ type: 'image', url: '', caption: '' }]);
      loadProjects();
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create project' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground mb-8">Published immediately to the public Projects page.</p>

        {projects.length > 0 && (
          <div className="mb-10">
            <h2 className="font-semibold mb-3">Existing projects</h2>
            <div className="space-y-2">
              {projects.map((p) => (
                <div key={p.id} className="border border-border bg-card rounded-lg p-3 text-sm">
                  <span className="font-medium">{p.title}</span>
                  {p.clientName && <span className="text-muted-foreground"> — {p.clientName}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Client name (optional)</label>
            <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short summary</label>
            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
              maxLength={500} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photos &amp; short videos</label>
            <div className="space-y-3">
              {media.map((m, idx) => (
                <div key={idx} className="flex gap-2 items-start border border-border rounded-lg p-3">
                  <select value={m.type} onChange={(e) => updateMedia(idx, 'type', e.target.value)}
                    className="px-2 py-2 border border-border rounded-lg bg-background text-sm shrink-0">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <div className="flex-1 space-y-2">
                    <input
                      placeholder={m.type === 'video' ? 'Video URL (mp4 link or YouTube/Vimeo link)' : 'Image URL'}
                      value={m.url}
                      onChange={(e) => updateMedia(idx, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    />
                    <input
                      placeholder="Caption (optional)"
                      value={m.caption}
                      onChange={(e) => updateMedia(idx, 'caption', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    />
                  </div>
                  {media.length > 1 && (
                    <button type="button" onClick={() => setMedia((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-destructive text-sm px-2 py-2">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setMedia((prev) => [...prev, { type: 'image', url: '', caption: '' }])}
              className="mt-3 text-sm font-medium text-primary hover:underline">
              + Add photo or video
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Paste hosted links (e.g. images from your own hosting/Drive, short clips from YouTube/Vimeo
              or a direct .mp4 link). Direct upload from your device isn&apos;t wired up yet.
            </p>
          </div>

          {result && (
            <p className={result.type === 'success' ? 'text-green-600 text-sm' : 'text-destructive text-sm'}>
              {result.message}
            </p>
          )}

          <button type="submit" disabled={submitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 disabled:opacity-50">
            {submitting ? 'Publishing...' : 'Publish project'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
