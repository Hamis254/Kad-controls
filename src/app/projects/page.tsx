'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface ProjectMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string | null;
}

interface Project {
  id: string;
  title: string;
  clientName?: string | null;
  summary?: string | null;
  description?: string | null;
  media: ProjectMedia[];
}

function isEmbeddableVideo(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

function toEmbedUrl(url: string) {
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function MediaItem({ item }: { item: ProjectMedia }) {
  if (item.type === 'video') {
    if (isEmbeddableVideo(item.url)) {
      return (
        <div className="aspect-video w-full">
          <iframe src={toEmbedUrl(item.url)} className="w-full h-full rounded-lg" allowFullScreen title={item.caption || 'Project video'} />
        </div>
      );
    }
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video controls className="w-full rounded-lg">
        <source src={item.url} />
      </video>
    );
  }
  return <Image src={item.url} alt={item.caption || ''} width={1200} height={224} sizes="(max-width: 640px) 100vw, 50vw" className="w-full h-56 object-cover rounded-lg" />;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((json) => { if (json.success) setProjects(json.data.projects); })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary text-primary-foreground px-6 py-16 sm:px-10 lg:px-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-4">Track record</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Our Projects</h1>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16 sm:px-10 lg:px-12">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-12">
              {projects.map((project) => (
                <article key={project.id} className="border border-border bg-card rounded-lg p-6">
                  <h2 className="text-2xl font-semibold">{project.title}</h2>
                  {project.clientName && <p className="text-sm text-muted-foreground mt-1">Client: {project.clientName}</p>}
                  {project.summary && <p className="mt-3 text-foreground/80">{project.summary}</p>}
                  {project.description && <p className="mt-3 text-foreground/80 whitespace-pre-wrap">{project.description}</p>}

                  {project.media.length > 0 && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {project.media.map((m) => <MediaItem key={m.id} item={m} />)}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Projects will appear here once added.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
