import { Optional } from "sequelize";

export interface ProductAttributes {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  popularityScore: number;
  preOrderRequired: boolean;
}

export type ProductSortOption =
    | "price_asc"
    | "price_desc"
    | "popularity"
    | "new_arrivals";

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id"> {}

export interface ProductCategoryAttributes {
  id: number;
  name: string;
  slug: string;
}
export interface ProductCategoryCreationAttributes
  extends Optional<ProductCategoryAttributes, "id"> {}
