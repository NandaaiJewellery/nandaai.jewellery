import { BaseService } from "./BaseService";
import { Product } from "../models";
import { ProductRepository } from "../repositories/product.repository";
import { ProductSortOption } from "../types/Product";

export class ProductService extends BaseService<Product> {
    protected repository: ProductRepository;

    constructor() {
        const repo = new ProductRepository();
        super(repo);
        this.repository = repo;
    }

    async getProducts(category?: string, sort: ProductSortOption = "popularity") {
        const where = category ? { product_category_id: category } : {};
        const order: [string, string][] = [];

        switch (sort) {
            case "price_asc":
                order.push(["discountedPrice", "ASC"]);
                break;
            case "price_desc":
                order.push(["discountedPrice", "DESC"]);
                break;
            case "new_arrivals":
                order.push(["created_at", "DESC"]);
                break;
            case "popularity":
            default:
                order.push(["popularity_score", "DESC"]);
        }

        return this.repository.findWithFilters({
            where,
            order,
        });
    }

    async getProductById(id: string | number) {
        const product = await this.repository.findById(id);
        return product; // keep null behavior (no throw)
    }
}