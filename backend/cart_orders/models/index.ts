import { Sequelize } from "sequelize";
import { initCartModel, Cart } from "./Cart";
import { initOrderModel, Order } from "./Order";
import { initOrderItemsModel, OrderItem } from "./OrderItems";

export const initModels = (sequelize: Sequelize) => {
  initCartModel(sequelize);
  initOrderModel(sequelize);
  initOrderItemsModel(sequelize);

  return {
    Cart,
    Order,
    OrderItem,
  };
};

export {
  Cart,
  Order,
  OrderItem,
};