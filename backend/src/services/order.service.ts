import { BaseService } from "./BaseService";
import { Order } from "../models";
import { OrderRepository } from "../repositories/orders.repository";
import { OrderItemRepository } from "../repositories/orderItems.repository";
import { sequelize } from "../config/database";
import { dynamicCacheKeys, staticCacheKeys } from "../types/ENUMS";
import { RedCacheable, InvalidateRedCache } from "../utils/cache";

export class OrderService extends BaseService<Order> {
    protected repository: OrderRepository;
    private orderItemRepo: OrderItemRepository;
    private static readonly PREFIX: string = staticCacheKeys.userOrdersCacheKey;
    private static readonly LABEL: string = staticCacheKeys.userOrdersCacheKey;

    constructor() {
        const repo = new OrderRepository();
        super(repo);
        this.repository = repo;
        this.orderItemRepo = new OrderItemRepository();
    }

    @InvalidateRedCache({
        prefix: OrderService.PREFIX,
        label: OrderService.LABEL
    })
    async createOrder(userId: number, totalAmount: number, items: any[]) {
        const transaction = await sequelize.transaction();

        try {
            const orderData = {
                userId,
                totalAmount,
                status: "pending",
            };
            const order = await this.repository.create(orderData);

            const orderItemsData = items.map((item) => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            }));

            await this.orderItemRepo.bulkCreate(orderItemsData, { transaction });

            await transaction.commit();

            return order;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    @RedCacheable({
        prefix: OrderService.PREFIX,
        key: (userId: string) => dynamicCacheKeys.userIdOrders(userId),
        ttl: 1800, // 30 min
        label: OrderService.LABEL
    })
    async getUserOrders(userId: number) {
        return this.repository.findByUser(userId, {
            include: [
                {
                    association: "OrderItems",
                    include: ["Product"],
                },
            ],
            order: [["created_at", "DESC"]],
        });
    }
}