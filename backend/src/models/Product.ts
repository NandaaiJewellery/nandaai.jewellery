import { Model, DataTypes, Sequelize } from "sequelize";
import { ProductAttributes, ProductCreationAttributes } from "../types/Product";

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
  declare id: string;
  declare name: string;
  declare originalPrice: number;
  declare discountedPrice: number;
  declare imageUrl: string;
  declare popularityScore: number;
  declare preOrderRequired: boolean;
}
export const initProductModel = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      originalPrice: {
        field: "original_price",
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue("originalPrice");
          return value ? parseFloat(String(value)) : 0;
        },
      },
      discountedPrice: {
        field: "discounted_price",
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue("discountedPrice");
          return value ? parseFloat(String(value)) : 0;
        },
      },
      imageUrl: {
        field: "image_url",
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      popularityScore: {
        field: "popularity_score",
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      preOrderRequired: {
        field: "pre_order_required",
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Product;
}
