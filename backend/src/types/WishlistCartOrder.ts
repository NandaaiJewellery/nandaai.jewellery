import { Optional } from "sequelize";

export interface CartAttributes {
  id: number;
  userId: number;
  productId: string;
  quantity: number;
}

export interface CartCreationAttributes
  extends Optional<CartAttributes, "id"> {}

export interface OrderAttributes {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  created_at?: Date;
}

export interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "created_at"> {}

export interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, "id"> {}

export interface WishlistAttributes {
  id: number;
  userId: number;
  productId: string;
}

export interface WishlistCreationAttributes
  extends Optional<WishlistAttributes, "id"> {}
