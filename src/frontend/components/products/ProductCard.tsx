'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';

import { Product } from '@/frontend/types';
import EnquiryModal from './EnquiryModal';

/* shadcn UI Primitives */
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const imageUrl = product.images?.[0]?.url || '/placeholder-product.png';

  const formattedPrice = product.price 
    ? `KES ${Number(product.price).toLocaleString()}` 
    : 'Quote on Request';

  return (
    <>
      <Card className="group flex h-full flex-col justify-between overflow-hidden border-border/80 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md">
        <div>
          {/* Product Image Header */}
          <Link href={`/product/${product.id}`} className="block relative aspect-4/3 w-full overflow-hidden bg-muted/40">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
            {product.category?.name && (
              <Badge 
                variant="secondary" 
                className="absolute left-3 top-3 bg-background/90 text-foreground text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
              >
                {product.category.name}
              </Badge>
            )}
          </Link>

          {/* Card Body */}
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {product.sku && (
                <span className="font-mono text-[11px] uppercase tracking-wide">
                  SKU: {product.sku}
                </span>
              )}
              {product.price && (
                <span className="font-bold text-foreground">
                  {formattedPrice}
                </span>
              )}
            </div>

            <Link href={`/product/${product.id}`}>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {product.shortDescription || product.description || 'High-grade electrical and automation equipment engineered for site reliability.'}
            </p>
          </CardContent>
        </div>

        {/* Card Footer Actions */}
        <CardFooter className="flex items-center gap-2 border-t border-border/60 p-4">
          <Button 
            onClick={() => setEnquiryOpen(true)}
            className="h-9 flex-1 gap-1.5 rounded-full bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Mail className="h-3.5 w-3.5" /> Send Enquiry
          </Button>

          <Link
            href={`/product/${product.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-accent px-3 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </CardFooter>
      </Card>

      {/* Enquiry Modal */}
      {enquiryOpen && (
        <EnquiryModal 
          productId={product.id} 
          productName={product.name} 
          onClose={() => setEnquiryOpen(false)} 
        />
      )}
    </>
  );
}