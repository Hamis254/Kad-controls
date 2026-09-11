'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Category, Product } from '@/types';

interface CategoryNode extends Category {
  children?: Category[];
}

export default function Catalogue() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories?tree=true')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCategoryTree(json.data.categories);
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const query = selectedCategory ? `?categoryId=${selectedCategory}&pageSize=48` : '?pageSize=48';

    fetch(`/api/products${query}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProducts(json.data.products);
        } else {
          setError(json.error || 'Failed to load products');
        }
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      })
      .finally(() => setIsLoading(false));
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Product Catalogue</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="font-bold text-lg mb-4">Filters</h3>

              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 accent-primary"
                    />
                    All Categories
                  </label>
                  {categoryTree.map((cat) => (
                    <div key={cat.id}>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={cat.id}
                          checked={selectedCategory === cat.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-2 accent-primary"
                        />
                        {cat.name}
                      </label>
                      {cat.children?.map((child) => (
                        <label key={child.id} className="flex items-center ml-5 mt-2">
                          <input
                            type="radio"
                            name="category"
                            value={child.id}
                            checked={selectedCategory === child.id}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mr-2 accent-primary"
                          />
                          <span className="text-muted-foreground">↳ {child.name}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive text-lg">{error}</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
