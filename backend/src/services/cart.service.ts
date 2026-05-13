import { BaseService } from "./BaseService";
import { Cart } from "../models";
import { CartRepository } from "../repositories/cart.repository";
import { RedCacheable, InvalidateRedCache } from "../utils/cache";
import { dynamicCacheKeys, staticCacheKeys } from "../types/ENUMS";

export class CartService extends BaseService<Cart> {
    private cartRepo: CartRepository;
    private static readonly PREFIX: string = staticCacheKeys.userCartItemsCacheKey;
    private static readonly LABEL: string = staticCacheKeys.userCartItemsCacheKey;

    constructor(cartRepo: CartRepository) {
        super(cartRepo);
        this.cartRepo = cartRepo;
    }

    @RedCacheable({
        prefix: CartService.PREFIX,
        key: (userId: string) => dynamicCacheKeys.userIdCartItems(userId),
        ttl: 1800, // 30 min
        label: CartService.LABEL
    })
    async getUserCart(userId: number) {
        return this.cartRepo.findByUser(userId);
    }

    @InvalidateRedCache({
        prefix: CartService.PREFIX,
        label: CartService.LABEL
    })
    async addToCart(userId: number, productId: string, quantity = 1) {
        const existing = await this.cartRepo.findExisting(userId, productId);

        if (existing) {
            return existing.update({
                quantity: existing.quantity + quantity,
            });
        }

        return this.cartRepo.create({
            userId,
            productId,
            quantity,
        });
    }

    @InvalidateRedCache({
        prefix: CartService.PREFIX,
        label: CartService.LABEL
    })
    async removeFromCart(userId: number, itemId: number) {
        const deleted = await this.cartRepo.delete({
            id: itemId,
            userId,
        });

        if (!deleted) throw new Error("NOT_FOUND");
    }
}