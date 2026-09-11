'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useCart } from '@/context/CartContext';
import { Product, Review } from '@/types';
import { useParams } from 'next/navigation';
import EnquiryModal from '@/components/products/EnquiryModal';

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setIsLoading(true);
    setNotFound(false);

    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProduct(json.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));

    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setReviews(json.data.reviews);
      })
      .catch((err) => console.error('Failed to load reviews:', err));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddError(null);
    setAdded(false);
    try {
      await addItem(product, quantity);
      setAdded(true);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add to quote list');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/catalogue" className="text-primary underline">Back to catalogue</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/catalogue" className="hover:text-foreground">Catalogue</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <div className="bg-card rounded-lg shadow-sm border border-border mb-4 overflow-hidden">
              <img
                src={product.images[selectedImage]?.url || '/placeholder-product.svg'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id ?? idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-full h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img src={img.url} alt="Product thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-accent text-2xl">
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            <div className="mb-6">
              {product.stock > 5 && <p className="text-green-600 font-semibold">In Stock</p>}
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-orange-600 font-semibold">Only {product.stock} left</p>
              )}
              {product.stock === 0 && <p className="text-destructive font-semibold">Out of Stock</p>}
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed">{product.description}</p>

            {product.stock > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <label className="font-semibold">Quantity:</label>
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-muted">−</button>
                    <span className="px-6 py-2 border-l border-r border-border">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2 hover:bg-muted">+</button>
                  </div>
                </div>

                {addError && <p className="text-destructive text-sm mb-3">{addError}</p>}
                {added && <p className="text-green-600 text-sm mb-3">Added to your quote list.</p>}

                <button
                  onClick={handleAddToCart}
                  className="w-full rounded-full px-6 py-3 bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
                >
                  Add to Quote List
                </button>
              </div>
            )}

            <button
              onClick={() => setEnquiryOpen(true)}
              className="w-full rounded-full px-6 py-3 border border-black text-foreground font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition mb-6"
            >
              Send Enquiry
            </button>

            <div className="border-t border-border pt-6">
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-foreground">SKU:</span>
                  <span className="ml-2 text-muted-foreground">{product.sku}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Category:</span>
                  <span className="ml-2 text-muted-foreground">{product.category?.name || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {enquiryOpen && (
          <EnquiryModal productId={product.id} productName={product.name} onClose={() => setEnquiryOpen(false)} />
        )}

        {/* Reviews Section */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{review.title}</p>
                      <p className="text-sm text-muted-foreground">by {review.user?.name || 'Anonymous'}</p>
                    </div>
                    <div className="text-accent">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-foreground/80">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
