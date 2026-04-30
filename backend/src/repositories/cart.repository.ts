import { BaseRepository } from "./BaseRepository";
import { Cart, Product } from "../models";

export class CartRepository extends BaseRepository<Cart> {
    constructor() {
        super(Cart);
    }

    async findByUser(userId: number) {
        return this.findAll({
            where: { userId },
            include: [Product],
        });
    }

    async findExisting(userId: number, productId: string) {
        return this.findOne({ userId, productId });
    }
}