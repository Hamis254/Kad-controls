'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="mx-auto grid w-full max-w-[1800px] gap-6 px-6 pt-6 pb-10 sm:px-10 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-12 lg:pt-8 lg:pb-14">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-bold tracking-wider text-primary-foreground border border-primary-foreground/30 uppercase backdrop-blur-sm">
                Turn-Key Electrical & Automation Solutions Provider
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Design. Supply. Install. Commission. One Team, Start to Finish.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                Kad Controls Ltd is a Turn-Key Electrical & Automation Solutions Provider, we dont just Supply parts, we handle the whole project: Solar PV, Automation Panels, BMS and Fire Alarm Systems, UPS and Industrial Lighting, designed, built and commissioned by our own team.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link 
                  href="/what-we-do" 
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-bold text-accent-foreground shadow-sm transition hover:bg-accent/90"
                >
                  Engineering Services
                </Link>
                <Link 
                  href="/catalogue" 
                  className="inline-flex items-center justify-center rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-8 py-3.5 font-bold transition hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
                >
                  Browse Catalogue
                </Link>
              </div>
            </div>

            <div className="relative w-full">
              <HeroGallery />
            </div>
          </div>
        </section>

        {/* Turn-Key Process Bar */}
        <section className="border-b border-border bg-card shadow-xs">
          <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-10 lg:px-12">
            {[
              ["01", "Site & Load Audit", "Tailored electrical & automation design"],
              ["02", "Component Sourcing", "Certified panels, drives & power hardware"],
              ["03", "On-Site Assembly", "Executed by qualified automation technicians"],
              ["04", "Testing & Handover", "Full safety audit and client training"],
            ].map(([step, title, text]) => (
              <div key={title} className="flex items-start gap-4 p-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary">
                  {step}
                </div>
                <div>
                  <p className="font-bold text-foreground">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="w-full px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-[1800px]">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Capabilities & Equipment</p>
                <h2 className="mt-0.5 text-3xl font-extrabold tracking-tight sm:text-4xl">System Categories</h2>
              </div>
              <Link href="/catalogue" className="text-sm font-bold text-primary hover:underline hover:underline-offset-4">
                View All Categories &rarr;
              </Link>
            </div>

            {categories.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalogue?categoryId=${cat.id}`}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
                  >
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground">{cat.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {cat.description || "Explore specialized solutions and technical components in this category."}
                      </p>
                    </div>
                    <div className="mt-4 text-sm font-bold text-primary">
                      Explore Category &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
                <p>Loading active product categories...</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="w-full border-t border-border bg-muted/40 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
          <div className="mx-auto w-full max-w-[1800px]">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Featured Industrial Products</h2>
              </div>
              <Link href="/catalogue" className="text-sm font-bold text-primary hover:underline hover:underline-offset-4">
                Explore Full Inventory &rarr;
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
                <p>No featured products available at this time.</p>
              </div>
            )}
          </div>
        </section>

        {/* Engineering Inquiry Banner */}
        <section className="bg-accent px-6 py-16 text-accent-foreground sm:px-10 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Require a Custom Control Panel or Solar Spec?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-accent-foreground/80">
              Our engineers assist with single-line diagrams, load estimation, and panel fabrication specs tailored to your factory or commercial installation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                Request Technical Quote &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Trusted Clients */}
        {clients.length > 0 && (
          <section className="border-t border-border bg-background px-6 pt-8 pb-6 sm:px-10 lg:px-12 lg:pt-10 lg:pb-8">
            <div className="mx-auto max-w-[1800px]">
              <p className="mb-5 text-left text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Trusted by Industrial & Commercial Partners
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-6 xl:grid-cols-7">
                {clients.map((client) => (
                  <div key={client.id} className="flex h-28 items-center justify-center rounded-xl border border-border bg-card p-4 transition hover:shadow-md hover:border-primary/40 sm:h-32 lg:h-36">
                    {client.logoUrl ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={client.logoUrl}
                          alt={client.name}
                          fill
                          sizes="(min-width:1024px) 14vw, (min-width:640px) 30vw, 45vw"
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-base font-bold text-muted-foreground text-center">{client.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}