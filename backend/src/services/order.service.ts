import { BaseService } from "./BaseService";
import { Order } from "../models";
import { OrderRepository } from "../repositories/orders.repository";
import { OrderItemRepository } from "../repositories/orderItems.repository";
import { sequelize } from "../config/database";

export class OrderService extends BaseService<Order> {
    protected repository: OrderRepository;
    private orderItemRepo: OrderItemRepository;

    constructor() {
        const repo = new OrderRepository();
        super(repo);
        this.repository = repo;
        this.orderItemRepo = new OrderItemRepository();
    }

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

    async getUserOrders(userId: number) {
        return this.repository.findByUser(userId, {
            include: [
                {
                    association: "OrderItems", // or model: OrderItem if not aliased
                    include: ["Product"],
                },
            ],
            order: [["created_at", "DESC"]],
        });
    }
}