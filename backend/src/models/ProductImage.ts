import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class ProductImage extends Model {
  declare id: number;
  declare image_url: string;
  declare product_category_id: number;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    product_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "product_images",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);
