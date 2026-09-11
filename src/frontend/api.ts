import { ApiResponse } from '@/frontend/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || 'API request failed', response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch data', 500);
  }
}

export async function fetchProducts(page: number = 1, pageSize: number = 12) {
  return apiCall('/api/products', {
    method: 'GET',
  });
}

export async function fetchProductById(id: string) {
  return apiCall(`/api/products/${id}`, {
    method: 'GET',
  });
}

export async function fetchCategories() {
  return apiCall('/api/categories', {
    method: 'GET',
  });
}

export async function fetchProductsByCategory(categoryId: string, page: number = 1) {
  return apiCall(`/api/products?categoryId=${categoryId}&page=${page}`, {
    method: 'GET',
  });
}

export async function fetchReviews(productId: string, page: number = 1) {
  return apiCall(`/api/reviews?productId=${productId}&page=${page}`, {
    method: 'GET',
  });
}

export async function submitReview(
  productId: string,
  data: {
    rating: number;
    title: string;
    comment: string;
  }
) {
  return apiCall('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({
      productId,
      ...data,
    }),
  });
}

export async function submitEnquiry(
  productId: string,
  data: {
    subject: string;
    message: string;
    email: string;
    phone?: string;
  }
) {
  return apiCall('/api/enquiries', {
    method: 'POST',
    body: JSON.stringify({
      productId,
      ...data,
    }),
  });
}

export async function createOrder(data: any) {
  return apiCall('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchOrders() {
  return apiCall('/api/orders', {
    method: 'GET',
  });
}

export async function fetchOrderById(id: string) {
  return apiCall(`/api/orders/${id}`, {
    method: 'GET',
  });
}