// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image?: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  order: number;
  createdAt: Date;
}

// Inventory Types
export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  lowStockThreshold: number;
  lastUpdated: Date;
}

// Cart Types
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
  priceAtAdd: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'stripe' | 'paypal' | 'google_pay';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// Review & Rating Types
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  productId: string;
  product?: Product;
  userId: string;
  user?: User;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Enquiry Types
export type EnquiryStatus = 'new' | 'in_progress' | 'responded' | 'closed';

export interface Enquiry {
  id: string;
  userId?: string;
  user?: User;
  productId: string;
  product?: Product;
  categoryId: string;
  category?: Category;
  subject: string;
  message: string;
  status: EnquiryStatus;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'review_request' | 'stock_available' | 'enquiry_response';
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  isRead: boolean;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}