'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/frontend/types';
import EnquiryModal from './EnquiryModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const imageUrl = product.images?.[0]?.url || '/placeholder-product.svg';

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition overflow-hidden flex flex-col">
        <Link href={`/product/${product.id}`}>
          <div className="relative w-full h-48 bg-muted overflow-hidden group cursor-pointer">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-foreground hover:text-primary mb-2 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
            {product.shortDescription || product.description}
          </p>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition text-sm font-semibold"
            >
              Send Enquiry
            </button>
            <Link
              href={`/product/${product.id}`}
              className="px-4 py-2 border border-black rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition text-sm font-semibold"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {enquiryOpen && (
        <EnquiryModal productId={product.id} productName={product.name} onClose={() => setEnquiryOpen(false)} />
      )}
    </>
  );
}
