import { Sequelize } from "sequelize";

import { initUserModel, User } from "./User";
import { initProductModel, Product } from "./Product";
import { initCartModel, Cart } from "./Cart";
import { initWishlistModel, Wishlist } from "./Wishlist";
import { initOrderModel, Order } from "./Order";
import { initProductCategoryModel, ProductCategory } from "./ProductCategory";
import { initOrderItemsModel, OrderItem } from "./OrderItems";

export const initModels = (sequelize: Sequelize) => {
  initUserModel(sequelize);
  initProductModel(sequelize);
  initCartModel(sequelize);
  initWishlistModel(sequelize);
  initOrderModel(sequelize);
  initProductCategoryModel(sequelize);
  initOrderItemsModel(sequelize);

  Product.belongsTo(ProductCategory, {
    foreignKey: "product_category_id",
  });

  ProductCategory.hasMany(Product, {
    foreignKey: "product_category_id",
  });

  User.hasMany(Cart, { foreignKey: "user_id" });
  Cart.belongsTo(User, { foreignKey: "user_id" });
  Cart.belongsTo(Product, { foreignKey: "product_id" });

  User.hasMany(Wishlist, { foreignKey: "user_id" });
  Wishlist.belongsTo(User, { foreignKey: "user_id" });
  Wishlist.belongsTo(Product, { foreignKey: "product_id" });

  User.hasMany(Order, { foreignKey: "user_id" });
  Order.belongsTo(User, { foreignKey: "user_id" });

  Order.hasMany(OrderItem, { foreignKey: "order_id" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });

  Product.hasMany(OrderItem, { foreignKey: "product_id" });
  OrderItem.belongsTo(Product, { foreignKey: "product_id" });

  return {
    User,
    Product,
    Cart,
    Wishlist,
    Order,
    ProductCategory,
    OrderItem,
  };
};

export {
  User,
  Product,
  Cart,
  Wishlist,
  Order,
  ProductCategory,
  OrderItem,
};