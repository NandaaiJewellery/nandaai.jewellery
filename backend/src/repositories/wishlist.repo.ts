import { BaseRepository } from "./BaseRepository";
import { Wishlist, Product } from "../models";

export class WishlistRepository extends BaseRepository<Wishlist> {
    constructor() {
        super(Wishlist);
    }

    async findByUser(userId: number) {
        return this.findAll({
            where: { userId },
            order: [["created_at", "DESC"]],
            include: [Product],
        });
    }

    async findOrCreateItem(userId: number, productId: string) {
        return Wishlist.findOrCreate({
            where: { userId, productId },
            defaults: { userId, productId },
        });
    }

    async deleteByUserAndId(userId: number, id: number) {
        return this.model.destroy({
            where: { id, userId },
        });
    }
}