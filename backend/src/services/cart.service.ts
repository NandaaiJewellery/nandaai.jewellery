import { BaseService } from "./BaseService";
import { Cart } from "../models";
import { CartRepository } from "../repositories/cart.repository";

export class CartService extends BaseService<Cart> {
    private cartRepo: CartRepository;

    constructor(cartRepo: CartRepository) {
        super(cartRepo);
        this.cartRepo = cartRepo;
    }

    async getUserCart(userId: number) {
        return this.cartRepo.findByUser(userId);
    }

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

    async removeFromCart(userId: number, itemId: number) {
        const deleted = await this.cartRepo.delete({
            id: itemId,
            userId,
        });

        if (!deleted) throw new Error("NOT_FOUND");
    }
}