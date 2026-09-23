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

interface EmployeeTestimonial {
  id: string;
  name: string;
  position: string;
  photoUrl?: string | null;
  testimonial: string;
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
  const [testimonials, setTestimonials] = useState<EmployeeTestimonial[]>([]);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((json) => { if (json.success) setJobs(json.data.jobs); })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/employee-testimonials')
      .then((res) => res.json())
      .then((json) => { if (json.success) setTestimonials(json.data.testimonials); })
      .catch(() => {});
  }, []);

  const applyLink = (job: Job) =>
    `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Application: ${job.title}`)}&body=${encodeURIComponent(
      `Hello,\n\nI would like to apply for the ${job.title} position.\n\nName:\nPhone:\nCV attached: \n\n`
    )}`;

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary text-primary-foreground px-6 py-16 sm:px-10 lg:px-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-4">Join us</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Careers</h1>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-3xl mx-auto">
            Kad Controls Ltd is an equal-opportunity employer — every role we post is open to any qualified candidate, and we never charge a fee at any stage of recruitment or interviews. If anyone asks you to pay to be considered for a position here, it isn&apos;t us. We&apos;re looking for genuine talent — people like you — not a fee.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16 sm:px-10 lg:px-12">
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

          {testimonials.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-semibold text-center mb-8">Life at Kad Controls</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {testimonials.map((testimonial) => {
                  const isOpen = expandedIds.has(testimonial.id);
                  const needsToggle = testimonial.testimonial.length > 100;

                  const avatar = testimonial.photoUrl && !failedLogos.has(testimonial.id) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={testimonial.photoUrl}
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover"
                      onError={() => setFailedLogos((prev) => new Set(prev).add(testimonial.id))}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                  );

                  return (
                    <div
                      key={testimonial.id}
                      className="border border-border bg-card rounded-lg p-4 flex flex-col"
                    >
                      {isOpen ? (
                        <>
                          {/* Expanded: header row (avatar + name/position), description below at full width */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="shrink-0">{avatar}</div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-sm leading-tight truncate">{testimonial.name}</h3>
                              <p className="text-xs text-muted-foreground leading-tight truncate">{testimonial.position}</p>
                            </div>
                          </div>
                          <p className="text-left italic text-foreground/80 text-sm whitespace-pre-wrap">
                            {testimonial.testimonial}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleExpanded(testimonial.id)}
                            className="mt-2 self-start text-xs font-semibold text-primary hover:underline"
                          >
                            Show less
                          </button>
                        </>
                      ) : (
                        /* Collapsed: photo/name/position on the left, description fills the remaining space on the right */
                        <div className="flex gap-3 items-start">
                          <div className="shrink-0 w-16 flex flex-col items-center text-center">
                            {avatar}
                            <h3 className="mt-2 font-semibold text-xs leading-tight">{testimonial.name}</h3>
                            <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{testimonial.position}</p>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-left italic text-foreground/80 text-sm whitespace-pre-wrap line-clamp-5">
                              {testimonial.testimonial}
                            </p>
                            {needsToggle && (
                              <button
                                type="button"
                                onClick={() => toggleExpanded(testimonial.id)}
                                className="mt-2 text-xs font-semibold text-primary hover:underline"
                              >
                                Read more
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}