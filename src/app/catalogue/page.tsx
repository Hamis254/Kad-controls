'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';
import ProductCard from '@/frontend/components/products/ProductCard';
import { Category, Product } from '@/frontend/types';

interface CategoryNode extends Category {
  children?: CategoryNode[];
}

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const res = await fetch('/api/categories?tree=true');
        const json = await res.json();
        if (!cancelled && json.success) setCategoryTree(json.data.categories);
      } catch {
        if (!cancelled) setCategoryTree([]);
      }
    }

    void loadCategories();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setIsLoading(true);
      setError(null);
      const query = selectedCategory ? `?categoryId=${selectedCategory}&pageSize=48` : '?pageSize=48';

      try {
        const res = await fetch(`/api/products${query}`);
        const json = await res.json();
        if (cancelled) return;
        if (json.success) {
          setProducts(json.data.products);
        } else {
          setError(json.error || 'Failed to load products');
        }
      } catch {
        if (!cancelled) setError('Failed to load products');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProducts();
    return () => { cancelled = true; };
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <h1 className="text-4xl font-bold mb-8">Product Catalogue</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 className="font-bold text-lg mb-4">Filters</h2>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="category" value="" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} className="mr-2 accent-primary" />
                  All Categories
                </label>
                {categoryTree.map((category) => (
                  <div key={category.id}>
                    <label className="flex items-center">
                      <input type="radio" name="category" value={category.id} checked={selectedCategory === category.id} onChange={() => setSelectedCategory(category.id)} className="mr-2 accent-primary" />
                      {category.name}
                    </label>
                    {category.children?.map((child) => (
                      <label key={child.id} className="flex items-center ml-5 mt-2">
                        <input type="radio" name="category" value={child.id} checked={selectedCategory === child.id} onChange={() => setSelectedCategory(child.id)} className="mr-2 accent-primary" />
                        <span className="text-muted-foreground">{child.name}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex-1" aria-live="polite">
            {isLoading ? (
              <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>
            ) : error ? (
              <p className="text-center py-12 text-destructive text-lg">{error}</p>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground text-lg">No products found</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
