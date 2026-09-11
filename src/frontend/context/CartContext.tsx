'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CartContextType } from './types';
import { CartItem } from '@/frontend/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface ServerCartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

async function callCartApi(method: string, body?: unknown, query?: string): Promise<ServerCartResponse> {
  const res = await fetch(`/api/cart${query ?? ''}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  const responseText = await res.text();
  let json: { success?: boolean; data?: ServerCartResponse; error?: string } = {};

  if (responseText) {
    try {
      json = JSON.parse(responseText);
    } catch {
      throw new Error(`Cart request failed (${res.status})`);
    }
  }

  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Cart request failed');
  }
  return json.data as ServerCartResponse;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await callCartApi('GET');
      setItems(data.items);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);

  const addItem = async (product: { id: string }, quantity: number) => {
    setError(null);
    const previous = items;
    try {
      const data = await callCartApi('POST', { productId: product.id, quantity });
      setItems(data.items);
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      throw err;
    }
  };

  const removeItem = async (productId: string) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    try {
      const data = await callCartApi('DELETE', undefined, `?productId=${productId}`);
      setItems(data.items);
    } catch (err) {
      setItems(previous);
      console.error('Failed to remove item:', err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const previous = items;
    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
    try {
      const data = await callCartApi('PATCH', { productId, quantity });
      setItems(data.items);
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  const clearCart = async () => {
    const previous = items;
    setItems([]);
    try {
      await callCartApi('DELETE');
    } catch (err) {
      setItems(previous);
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, isLoading, error, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
