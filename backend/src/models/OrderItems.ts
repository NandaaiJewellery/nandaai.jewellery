import { DataTypes, Model, Sequelize } from "sequelize";
import { Order } from "./Order";
import { Product } from "./Product";
import {
  OrderItemAttributes,
  OrderItemCreationAttributes,
} from "../types/WishlistCartOrder";

export class OrderItem extends Model<
  OrderItemAttributes,
  OrderItemCreationAttributes
> implements OrderItemAttributes {
  declare id: number;
  declare orderId: number;
  declare productId: string;
  declare quantity: number;
  declare price: number;
}

export const initOrderItemsModel = (sequelize: Sequelize) => {
  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        field: "order_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Order,
          key: "id",
        },
      },
      productId: {
        field: "product_id",
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Product,
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "order_items",
      timestamps: false,
    }
  );

  return OrderItem;
}
