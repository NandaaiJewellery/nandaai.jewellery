import API_BASE, { api } from "./client";
import type { Product, ProductCat } from "@/types";

export type ProductsParams = {
  category?: string;
  sort?: string;
};

export async function getProductCategories(): Promise<ProductCat[]> {
  return api.get<ProductCat[]>("/catalogue");
}

export async function fetchProducts(
  params?: ProductsParams
): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.sort) search.set("sort", params.sort);
  const q = search.toString();
  return api.get<Product[]>(`/products${q ? `?${q}` : ""}`);
}

export async function getProductById(id: string): Promise<Product> {
  return await api.get<Product>(`/products/${id}`);
}

export function getProductImageUrl(url: string): string {
  return url.includes("products/") ? `${API_BASE}/api/images/${url}` : url;
}
