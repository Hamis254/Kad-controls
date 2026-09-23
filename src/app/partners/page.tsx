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

function useDominantColor(url: string | null | undefined) {
  const [colorState, setColorState] = useState<{ url: string | null; color: string | null }>({ url: null, color: null });

  useEffect(() => {
    if (!url) {
      return;
    }

    let isCurrent = true;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (!isCurrent) return;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const context = canvas.getContext('2d');
        if (!context) {
          setColorState({ url, color: null });
          return;
        }

        context.drawImage(image, 0, 0, 40, 40);
        const pixels = context.getImageData(0, 0, 40, 40).data;
        let red = 0;
        let green = 0;
        let blue = 0;
        let count = 0;

        for (let index = 0; index < pixels.length; index += 4) {
          const pixelRed = pixels[index];
          const pixelGreen = pixels[index + 1];
          const pixelBlue = pixels[index + 2];
          const alpha = pixels[index + 3];
          if (alpha < 128 || (pixelRed > 235 && pixelGreen > 235 && pixelBlue > 235)) continue;

          red += pixelRed;
          green += pixelGreen;
          blue += pixelBlue;
          count += 1;
        }

        setColorState({
          url,
          color: count > 0 ? `rgb(${Math.round(red / count)}, ${Math.round(green / count)}, ${Math.round(blue / count)})` : null,
        });
      } catch {
        setColorState({ url, color: null });
      }
    };
    image.onerror = () => {
      if (isCurrent) setColorState({ url, color: null });
    };
    image.src = url;

    return () => {
      isCurrent = false;
    };
  }, [url]);

  return colorState.url === url ? colorState.color : null;
}

function PartnerCard({ partner, failedLogos, setFailedLogos }: {
  partner: Partner;
  failedLogos: Set<string>;
  setFailedLogos: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const dominantColor = useDominantColor(partner.logoUrl);

  return (
    <div className="flex flex-col border border-border bg-card rounded-lg p-3 text-center">
      <div className="h-1 -mt-3 -mx-3 mb-2 rounded-t-lg" style={{ backgroundColor: dominantColor || 'transparent' }} />
      <div className="flex h-12 items-center justify-center mb-2">
        {partner.logoUrl && !failedLogos.has(partner.id) ? (
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="max-h-full max-w-full object-contain"
            onError={() => setFailedLogos((prev) => new Set(prev).add(partner.id))}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-base">
            {partner.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{partner.name}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{partner.role}</p>
      {partner.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{partner.description}</p>}
    </div>
  );
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());

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
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 items-stretch">
              {partners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  failedLogos={failedLogos}
                  setFailedLogos={setFailedLogos}
                />
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
