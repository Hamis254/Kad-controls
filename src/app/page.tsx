'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Cpu, Package, PenTool, Sun, Wrench, Zap } from "lucide-react";
import Navbar from "@/frontend/components/common/Navbar";
import Footer from "@/frontend/components/common/Footer";
import ProductCard from "@/frontend/components/products/ProductCard";
import HeroGallery from "@/frontend/components/common/HeroGallery";
import { Category, Product } from "@/frontend/types";

interface ClientItem {
  id: string;
  name: string;
  logoUrl?: string | null;
}

const categoryIcons: Record<string, typeof Sun> = {
  solar: Sun,
  automation: Cpu,
  panels: Zap,
};

function iconForCategory(slug: string) {
  const key = Object.keys(categoryIcons).find((k) => slug.includes(k));
  return key ? categoryIcons[key] : Zap;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);

  useEffect(() => {
    fetch('/api/categories?tree=true')
      .then((res) => res.json())
      .then((json) => { if (json.success) setCategories(json.data.categories); })
      .catch(() => {});

    fetch('/api/products?pageSize=3')
      .then((res) => res.json())
      .then((json) => { if (json.success) setFeaturedProducts(json.data.products); })
      .catch(() => {});

    fetch('/api/clients')
      .then((res) => res.json())
      .then((json) => { if (json.success) setClients(json.data.clients); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-4 px-6 py-20 sm:px-10 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:px-12 lg:py-28">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                <Zap className="h-4 w-4" /> Turn-key solution provider
              </p>
              <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Design. Supply. Install. Commission. One team, start to finish.
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-primary-foreground/80">
                Kad Controls Ltd is a turn-key solution provider — we don&apos;t just supply parts, we
                handle the whole project: solar PV, automation panels, BMS and fire alarm systems,
                UPS/generators and industrial lighting, designed, built and commissioned by our own team.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/what-we-do" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:opacity-90">
                  See what we do <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/catalogue" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 font-semibold transition hover:border-accent hover:text-accent">
                  Browse the catalogue
                </Link>
              </div>
            </div>

            <HeroGallery />
          </div>
        </section>

        {/* Turn-key process */}
        <section className="border-b border-border bg-secondary">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-4 sm:px-10 lg:px-12">
            {[
              [PenTool, "1. Design", "Solution designed around your site"],
              [Package, "2. Supply", "Panels and systems supplied"],
              [Wrench, "3. Install", "Installed by our own technicians"],
              [CheckCircle2, "4. Commission", "Tested, commissioned, handed over"],
            ].map(([Icon, title, text]) => {
              const FeatureIcon = Icon as typeof Wrench;
              return (
                <div key={title as string} className="flex items-center gap-4">
                  <FeatureIcon className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">{title as string}</p>
                    <p className="text-sm text-muted-foreground">{text as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Clients */}
        {clients.length > 0 && (
          <section className="border-b border-border px-6 py-12 sm:px-10 lg:px-12">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-8">
              Trusted by
            </p>
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {clients.map((client) =>
                client.logoUrl ? (
                  <img key={client.id} src={client.logoUrl} alt={client.name} className="h-10 object-contain grayscale opacity-70 hover:opacity-100 transition" />
                ) : (
                  <span key={client.id} className="text-lg font-semibold text-muted-foreground">{client.name}</span>
                )
              )}
            </div>
          </section>
        )}

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Product range</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight">Shop by category</h2>
            </div>
            <Link href="/catalogue" className="hidden items-center gap-2 font-semibold sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => {
                const Icon = iconForCategory(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    href={`/catalogue?categoryId=${cat.id}`}
                    className="group border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary"
                  >
                    <Icon className="h-8 w-8 text-primary transition group-hover:text-accent" />
                    <h3 className="mt-12 text-xl font-semibold">{cat.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{cat.description}</p>
                    <ArrowRight className="mt-6 h-4 w-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Categories will appear here once added.</p>
          )}
        </section>

        {/* Featured products */}
        <section className="bg-secondary px-6 py-20 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">In stock now</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight">Featured products</h2>
              </div>
              <Link href="/catalogue" className="hidden items-center gap-2 font-semibold sm:flex">
                Browse everything <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {featuredProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Products will appear here once added to the catalogue.</p>
            )}
          </div>
        </section>

        <section className="bg-accent px-6 py-16 text-center sm:px-10">
          <h2 className="text-4xl font-semibold tracking-tight text-accent-foreground">Need a system designed for your site?</h2>
          <p className="mx-auto mt-4 max-w-md text-accent-foreground/80">Send us your requirements and our technical team will help you spec the right panel or solar system.</p>
          <Link href="/catalogue" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
            Browse the catalogue <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}