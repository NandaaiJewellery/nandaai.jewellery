import { Model, DataTypes, Sequelize } from "sequelize";
import {
  WishlistAttributes,
  WishlistCreationAttributes,
} from "../types/WishlistCartOrder";

export class Wishlist
  extends Model<WishlistAttributes, WishlistCreationAttributes>
  implements WishlistAttributes {
  declare id: number;
  declare userId: number;
  declare productId: string;
}

export const initWishlistModel = (sequelize: Sequelize) => {
  Wishlist.init(
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
    },
    {
      sequelize,
      tableName: "wishlist",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Wishlist;
};