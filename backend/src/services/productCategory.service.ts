import { BaseService } from "./BaseService";
import { ProductCategory } from "../models/ProductCategory";
import { ProductCategoryRepository } from "../repositories/productCategory.repository";
import { staticCacheKeys } from "../types/ENUMS";
import { RedCacheable, InvalidateRedCache } from "../utils/cache";

export class ProductCategoryService extends BaseService<ProductCategory> {
    protected repository: ProductCategoryRepository;
    private static readonly PREFIX: string = staticCacheKeys.catalogueCacheKey;
    private static readonly LABEL: string = staticCacheKeys.catalogueCacheKey;

    constructor() {
        const repo = new ProductCategoryRepository();
        super(repo);
        this.repository = repo;
    }

    @RedCacheable({
        prefix: ProductCategoryService.PREFIX,
        key: () => "all",
        ttl: 1800, // 30 min
        label: ProductCategoryService.LABEL
    })
    async getAllCategories() {
        return await this.repository.findAll({
            order: [["name", "ASC"]],
        });
    }

    @RedCacheable({
        prefix: ProductCategoryService.PREFIX,
        key: (id: number | string) => `${id}`,
        ttl: 1800, // 30 min
        label: ProductCategoryService.LABEL
    })
    async getCategoryById(id: number | string) {
        return this.getById(id) ?? null;
    }

    @InvalidateRedCache({
        prefix: ProductCategoryService.PREFIX,
        label: ProductCategoryService.LABEL
    })
    async createCategory(name: string, slug: string) {
        if (!name || !slug) {
            throw new Error("name and slug are required");
        }

        const existing = await this.repository.findBySlug(slug);
        if (existing) {
            throw new Error("SLUG_EXISTS");
        }

        return this.repository.create({ name, slug });
    }

    @InvalidateRedCache({
        prefix: ProductCategoryService.PREFIX,
        label: ProductCategoryService.LABEL
    })
    async updateCategory(
        id: number | string,
        name?: string,
        slug?: string
    ) {
        const category = await this.repository.findById(id);
        if (!category) throw new Error("NOT_FOUND");

        if (slug) {
            const slugExists = await this.repository.findBySlug(slug);

            if (slugExists && slugExists.id !== Number(id)) {
                throw new Error("SLUG_EXISTS");
            }
        }

        return this.repository.update(category, {
            name: name ?? category.name,
            slug: slug ?? category.slug,
        });
    }

    @InvalidateRedCache({
        prefix: ProductCategoryService.PREFIX,
        label: ProductCategoryService.LABEL
    })
    async deleteCategory(id: number | string) {
        const deleted = await this.repository.delete({ id } as any);

        if (!deleted) {
            throw new Error("NOT_FOUND");
        }
    }
}