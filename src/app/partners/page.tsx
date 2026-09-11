'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

interface Partner {
  id: string;
  name: string;
  role: string;
  description?: string | null;
  logoUrl?: string | null;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/partners')
      .then((res) => res.json())
      .then((json) => { if (json.success) setPartners(json.data.partners); })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary text-primary-foreground px-6 py-16 sm:px-10 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-4">Who we work with</p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Our Partners</h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              We source components and systems from established manufacturers so every panel, solar
              system and control unit we deliver is built to spec and backed by proper support.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16 sm:px-10 lg:px-12">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : partners.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <div key={partner.id} className="border border-border bg-card rounded-lg p-6 text-center">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="w-16 h-16 mx-auto mb-4 object-contain" />
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xl">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground">{partner.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{partner.role}</p>
                  {partner.description && <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Partners will appear here once added.</p>
          )}
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Interested in partnering with us? <a href="/contact" className="text-primary underline">Get in touch</a>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
