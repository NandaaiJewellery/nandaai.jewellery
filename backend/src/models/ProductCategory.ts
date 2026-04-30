import { DataTypes, Model, Sequelize } from "sequelize";
import {
  ProductCategoryAttributes,
  ProductCategoryCreationAttributes,
} from "../types/Product";

export class ProductCategory extends Model<
  ProductCategoryAttributes,
  ProductCategoryCreationAttributes
> {
  declare id: number;
  declare name: string;
  declare slug: string;
}

export const initProductCategoryModel = (sequelize: Sequelize) => {
  ProductCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "product_category_master",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      indexes: [
        {
          name: "product_category_master_name_ci",
          unique: true,
          fields: [
            sequelize.fn("lower", sequelize.col("name")),
          ],
        },
        {
          name: "product_category_master_slug_ci",
          unique: true,
          fields: [
            sequelize.fn("lower", sequelize.col("slug")),
          ],
        },
      ],
    }
  );

  return ProductCategory;
}