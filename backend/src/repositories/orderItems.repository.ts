import { OrderItem } from "../models";

export class OrderItemRepository {
    async bulkCreate(data: any[], options?: any) {
        return OrderItem.bulkCreate(data, options);
    }
}