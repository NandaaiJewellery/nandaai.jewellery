import { BaseRepository } from "./BaseRepository";
import { ProductCategory } from "../models/ProductCategory";

export class ProductCategoryRepository extends BaseRepository<ProductCategory> {
    constructor() {
        super(ProductCategory);
    }

    async findBySlug(slug: string) {
        return this.findOne({ slug });
    }
}