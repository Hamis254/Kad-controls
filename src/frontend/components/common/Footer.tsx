'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-primary-foreground font-bold text-lg mb-4">Kad Controls</h3>
            <p className="font-tagline text-lg mb-2">&ldquo;For All Your Electrical Needs&rdquo;</p>
            <p className="text-sm">
              A turn-key solution — we design, supply, install and commission solar systems, custom
              panels, automation and BMS. One team, start to finish. Over 16 years in the industry.
            </p>
          </div>

          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
              <li><Link href="/what-we-do" className="hover:text-accent">What We Do</Link></li>
              <li><Link href="/projects" className="hover:text-accent">Projects</Link></li>
              <li><Link href="/our-values" className="hover:text-accent">Our Values</Link></li>
              <li><Link href="/catalogue" className="hover:text-accent">Shop</Link></li>
              <li><Link href="/partners" className="hover:text-accent">Partners</Link></li>
              <li><Link href="/careers" className="hover:text-accent">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Contact — Kenya</h4>
            <ul className="space-y-2 text-sm">
              <li>Prabhaki Industrial Park, Godown C3, Babadogo, Nairobi</li>
              <li><a href="tel:+254772600242" className="hover:text-accent">+254 772 600 242</a></li>
              <li><a href="mailto:info@kadcontrols.co.ke" className="hover:text-accent">info@kadcontrols.co.ke</a></li>
              <li><Link href="/contact" className="hover:text-accent">Full contact details →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary-foreground font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.facebook.com/KAD-Controls-Limited-348235419330444" aria-label="Facebook" className="inline-flex items-center gap-2 hover:text-accent"><FaFacebook aria-hidden="true" size={16} />Facebook</a></li>
              <li><a href="https://www.linkedin.com/in/kad-controls-limited-33bb00112/" aria-label="LinkedIn" className="inline-flex items-center gap-2 hover:text-accent"><FaLinkedin aria-hidden="true" size={16} />LinkedIn</a></li>
              <li><a href="https://www.instagram.com/KADcontrols" aria-label="Instagram" className="inline-flex items-center gap-2 hover:text-accent"><FaInstagram aria-hidden="true" size={16} />Instagram</a></li>
              <li><a href="https://www.twitter.com/ControlsKad" aria-label="Twitter" className="inline-flex items-center gap-2 hover:text-accent"><FaTwitter aria-hidden="true" size={16} />Twitter</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 pt-8 text-center">
          <p className="text-sm">&copy; {currentYear} Kad Controls Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
