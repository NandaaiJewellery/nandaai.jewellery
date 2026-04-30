import { Model, DataTypes, Sequelize } from "sequelize";
import { OrderAttributes, OrderCreationAttributes } from "../types/WishlistCartOrder";

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes {
  declare id: number;
  declare userId: number;
  declare totalAmount: number;
  declare status: string;
  declare created_at: Date;
}

export const initOrderModel = (sequelize: Sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        field: "total_amount",
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue("totalAmount");
          return value ? parseFloat(String(value)) : 0;
        },
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "placed",
      },
    },
    {
      sequelize,
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Order;
}
