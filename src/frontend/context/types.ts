import React, { ReactNode } from 'react';
import { CartItem, Product } from '@/frontend/types';

export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Pick<Product, 'id'>, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}