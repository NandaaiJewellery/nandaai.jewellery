import { BaseRepository } from "./BaseRepository";
import { Order } from "../models";
import { FindOptions } from "sequelize";

export class OrderRepository extends BaseRepository<Order> {
    constructor() {
        super(Order);
    }

    async findByUser(userId: number, options?: FindOptions) {
        return this.findAll({
            where: { userId },
            ...options,
        });
    }
}