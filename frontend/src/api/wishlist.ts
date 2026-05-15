import { api } from './client';
import type { WishlistItem } from '@/types';

export async function getWishlist(): Promise<WishlistItem[]> {
  return api.get<WishlistItem[]>('/wishlist');
}

export async function addToWishlist(productId: string): Promise<WishlistItem> {
  return api.post<WishlistItem>('/wishlist/add', { productId: productId });
}

export async function removeFromWishlist(itemId: number): Promise<void> {
  return api.delete(`/wishlist/${itemId}`);
}
