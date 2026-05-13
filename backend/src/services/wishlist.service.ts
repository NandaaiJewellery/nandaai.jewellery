import { BaseService } from "./BaseService";
import { Wishlist } from "../models";
import { WishlistRepository } from "../repositories/wishlist.repo";
import { LRUCacheable, InvalidateLRUCache } from "../utils/cache";
import { wishlistCache } from "../config/lru";
import { dynamicCacheKeys, staticCacheKeys } from "../types/ENUMS";

export class WishlistService extends BaseService<Wishlist> {
    protected repository: WishlistRepository;
    private static readonly PREFIX: string = staticCacheKeys.wishlistCacheKey + ":user:";
    private static readonly LABEL: string = staticCacheKeys.wishlistCacheKey;

    constructor() {
        const repo = new WishlistRepository();
        super(repo);
        this.repository = repo;
    }

    @LRUCacheable({
        cache: wishlistCache,
        key: (userId: number) =>
            dynamicCacheKeys.userIdWishlist(userId),
        ttl: 1800,
        label: WishlistService.LABEL,
    })
    async getUserWishlist(userId: number) {
        return this.repository.findByUser(userId);
    }

    @InvalidateLRUCache({
        cache: wishlistCache,
        label: WishlistService.LABEL,
        prefix: WishlistService.PREFIX,
    })
    async addToWishlist(userId: number, productId: string) {
        if (!productId) {
            throw new Error("PRODUCT_ID_REQUIRED");
        }

        const [item] = await this.repository.findOrCreateItem(
            userId,
            productId
        );

        return item;
    }

    @InvalidateLRUCache({
        cache: wishlistCache,
        prefix: WishlistService.PREFIX,
        label: WishlistService.LABEL
    })
    async removeFromWishlist(userId: number, itemId: number) {
        return await this.repository.deleteByUserAndId(
            userId,
            itemId
        );
    }
}