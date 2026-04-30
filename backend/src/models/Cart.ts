import { Model, DataTypes, Sequelize } from "sequelize";
import { CartAttributes, CartCreationAttributes } from "../types/WishlistCartOrder";

export class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes {
  declare id: number;
  declare userId: number;
  declare productId: string;
  declare quantity: number;
}
export const initCartModel = (sequelize: Sequelize) => {
  Cart.init(
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
      productId: {
        field: "product_id",
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: "cart",
      timestamps: false,
    }
  );

  return Cart;
}
