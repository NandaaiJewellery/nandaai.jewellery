import { api } from "./client";
import type { Order } from "@/types";

export async function getOrders(): Promise<Order[]> {
  return api.get<Order[]>("/orders");
}

interface OrderItemPayload {
  product_id: number;
  quantity: number;
  price: number;
}

export async function createOrder(
  totalAmount: number,
  items: OrderItemPayload[]
): Promise<Order> {
  return api.post<Order>("/orders/create", {
    total_amount: totalAmount,
    items,
  });
}

export async function getCustomerOrders(): Promise<Order[]> {
  return api.get<Order[]>("/orders");
}
