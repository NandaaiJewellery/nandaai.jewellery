import { BaseService } from "./BaseService";
import { Wishlist } from "../models";
import { WishlistRepository } from "../repositories/wishlist.repo";

export class WishlistService extends BaseService<Wishlist> {
    protected repository: WishlistRepository;

    constructor() {
        const repo = new WishlistRepository();
        super(repo);
        this.repository = repo;
    }

    async getUserWishlist(userId: number) {
        return this.repository.findByUser(userId);
    }

    async addToWishlist(userId: number, productId?: string) {
        if (!productId) {
            throw new Error("PRODUCT_ID_REQUIRED");
        }

        const [item] = await this.repository.findOrCreateItem(
            userId,
            productId
        );

        return item;
    }

    async removeFromWishlist(userId: number, itemId: number) {
        const deleted = await this.repository.deleteByUserAndId(
            userId,
            itemId
        );

        if (deleted === 0) {
            throw new Error("NOT_FOUND");
        }
    }
}