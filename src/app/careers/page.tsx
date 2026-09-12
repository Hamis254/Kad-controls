'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface Job {
  id: string;
  title: string;
  department?: string | null;
  location?: string | null;
  employmentType: string;
  description: string;
}

const APPLY_EMAIL = 'georgemutinda@saleskadcontrols.co.ke';

const employmentTypeLabels: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((json) => { if (json.success) setJobs(json.data.jobs); })
      .finally(() => setIsLoading(false));
  }, []);

  const applyLink = (job: Job) =>
    `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Application: ${job.title}`)}&body=${encodeURIComponent(
      `Hello,\n\nI would like to apply for the ${job.title} position.\n\nName:\nPhone:\nCV attached: \n\n`
    )}`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary text-primary-foreground px-6 py-16 sm:px-10 lg:px-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-4">Join us</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Careers</h1>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16 sm:px-10 lg:px-12">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <details key={job.id} className="group border border-border bg-card rounded-lg p-6">
                  <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {employmentTypeLabels[job.employmentType] || job.employmentType}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {[job.department, job.location].filter(Boolean).join(' — ')}
                    </p>
                  </summary>
                  <div className="pt-4">
                    <p className="text-foreground/80 whitespace-pre-wrap mb-4">{job.description}</p>
                    <a href={applyLink(job)} className="inline-flex rounded-full px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                      Apply via email
                    </a>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No open positions right now — check back soon.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
