'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/frontend/context/CartContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/what-we-do', label: 'What We Do' },
  { href: '/projects', label: 'Projects' },
  { href: '/our-values', label: 'Our Values' },
  { href: '/partners', label: 'Partners' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // White background because the logo has a white/transparent background — text/hover
    // colors reference the theme (text-primary / bg-primary), not hardcoded hex, so a
    // future palette change (globals.css) still applies here automatically.
    <nav className="sticky top-0 z-50 overflow-x-hidden bg-white text-primary shadow-[0_6px_20px_rgba(54,28,14,0.08)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-2 py-2 sm:gap-3 sm:py-3">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white sm:h-14 sm:w-14 md:h-16 md:w-16">
              <Image src="/logo.png" alt="Kad Controls logo" width={80} height={80} className="h-full w-full scale-[1.12] object-contain" priority />
            </div>

            <div className="flex min-w-0 flex-col leading-none">
              <span className="font-wordmark whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.12em] text-primary sm:text-[0.8rem] md:text-[0.95rem]">
                KAD CONTROLS LIMITED
              </span>
              <span className="font-tagline mt-0.5 whitespace-nowrap text-[0.85rem] text-black sm:text-[1.05rem] md:text-[1.2rem]">
                For All Your Electrical Needs
              </span>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center xl:flex">
            <div className="flex items-center gap-1.5 md:gap-2.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`whitespace-nowrap rounded-full px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.08em] transition md:text-[0.7rem] ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-black hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/cart" className="relative p-1.5 text-primary transition hover:opacity-75 sm:p-2" aria-label="Quote list" title="Quote list">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-primary sm:h-5 sm:w-5 sm:text-[10px]">
                  {totalItems}
                </span>
              )}
            </Link>

            <button type="button" className="p-1.5 xl:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
              {menuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-3 pb-4 xl:hidden">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-primary" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
