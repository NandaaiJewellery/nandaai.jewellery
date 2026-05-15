export interface Product {
  id: string;
  name: string;
  product_category_id: number;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  popularityScore: number;
  created_at?: string;
}

export type ProductCat = {
  id: number;
  name: string;
  slug: string;
};

export type SortOption =
  | "popularity"
  | "price_asc"
  | "price_desc"
  | "new_arrivals";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: string;
  quantity: number;
  Product?: Product;
}

export interface WishlistItem {
  id: number;
  userId: number;
  productId: string;
  Product?: Product;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  quantity: number;
  price: number;
  Product: Product;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  created_at: string;
  updated_at: string;
  OrderItems: OrderItem[];
}
