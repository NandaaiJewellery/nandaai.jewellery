import { BaseService } from "./BaseService";
import { Product } from "../models";
import { ProductRepository } from "../repositories/product.repository";
import { ProductSortOption } from "../types/Product";
import { RedCacheable } from "../utils/cache";
import { dynamicCacheKeys, staticCacheKeys } from "../types/ENUMS";

export class ProductService extends BaseService<Product> {
    protected repository: ProductRepository;
    private static readonly PREFIX: string = staticCacheKeys.productsCacheKey;
    private static readonly LABEL: string = staticCacheKeys.productsCacheKey;

    constructor() {
        const repo = new ProductRepository();
        super(repo);
        this.repository = repo;
    }

    @RedCacheable({
        prefix: ProductService.PREFIX,
        key: (category?: string, sort?: string) =>
            dynamicCacheKeys.productsCache(category, sort),
        ttl: 1800, // 30 min
        label: ProductService.LABEL
    })
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

    @RedCacheable({
        prefix: ProductService.PREFIX,
        key: (id: string | number) => `${id}`,
        ttl: 1800, // 30 min
        label: ProductService.LABEL
    })
    async getProductById(id: string | number) {
        return await this.repository.findById(id);
    }
}