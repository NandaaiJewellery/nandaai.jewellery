import { BaseRepository } from "./BaseRepository";
import { Cart } from "../models";

export class CartRepository extends BaseRepository<Cart> {
    constructor() {
        super(Cart);
    }

    async findByUser(userId: number) {
        return this.findAll({
            where: { userId },
            order: [["id", "DESC"]],
        });
    }

    async findExisting(userId: number, productId: string) {
        return this.findOne({ userId, productId });
    }
}