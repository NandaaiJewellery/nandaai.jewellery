import { api } from './client';
import type { CartItem } from '@/types';

export async function getCart(): Promise<CartItem[]> {
  return api.get<CartItem[]>('/cart');
}

export async function addToCart(productId: string, quantity = 1): Promise<CartItem> {
  return api.post<CartItem>('/cart/add', { productId, quantity });
}

export async function removeFromCart(itemId: number): Promise<void> {
  return api.delete(`/cart/${itemId}`);
}
