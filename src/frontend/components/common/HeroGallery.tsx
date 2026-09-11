'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&q=80',
    label: 'Solar PV Installation',
  },
  {
    src: '/2MVA Transformer.jpg',
    label: '2MVA Transformer Installation',
  },
  {
    src: '/Control panel with PLC.jpg',
    label: 'PLC Control Panel',
  },
  {
    src: '/control panel.jpg',
    label: 'Electrical Control Panel',
  },
  {
    src: '/Onsite installation.jpg',
    label: 'On-Site Panel Installation',
  },
  {
    src: '/Onsite transformer installation.jpg',
    label: 'On-Site Transformer Testing',
  },
];

export default function HeroGallery() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative hidden h-full w-full min-h-115 lg:block">
      <style jsx>{`
        @keyframes heroFloatMain {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .hero-float-main {
          animation: heroFloatMain 6s ease-in-out infinite;
        }
      `}</style>

      <div className="hero-float-main relative h-full w-full overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl">
        {SLIDES.map((slide, idx) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.label}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              idx === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4">
          <p className="font-tagline text-2xl text-white">{SLIDES[active].label}</p>
        </div>
      </div>

      {/* Slide indicators, pinned inside the photo's bottom-right corner */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show ${slide.label}`}
            onClick={() => setActive(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === active ? 'w-6 bg-accent' : 'w-2 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}