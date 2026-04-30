import { BaseService } from "./BaseService";
import { ProductCategory } from "../models/ProductCategory";
import { ProductCategoryRepository } from "../repositories/productCategory.repository";

export class ProductCategoryService extends BaseService<ProductCategory> {
    protected repository: ProductCategoryRepository;

    constructor() {
        const repo = new ProductCategoryRepository();
        super(repo);
        this.repository = repo;
    }

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

    async getAllCategories() {
        return this.repository.findAll({
            order: [["created_at", "DESC"]],
        });
    }

    async getCategoryById(id: number | string) {
        return this.getById(id); // uses BaseService (throws NOT_FOUND)
    }

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

    async deleteCategory(id: number | string) {
        const deleted = await this.repository.delete({ id } as any);

        if (!deleted) {
            throw new Error("NOT_FOUND");
        }
    }
}