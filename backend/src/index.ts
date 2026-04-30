import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { sequelize } from "./config/database";
import "./models";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import productCategoryRoutes from "./routes/productCategories";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import orderRoutes from "./routes/orders";
import superRoutes from "./routes/superAuth";
import uploadRoutes from "./routes/uploads";
import imagesRoute from "./routes/images";

const app = express();
const PORT = process.env.EXPRESS_PORT!;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/catalogue", productCategoryRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/orders", orderRoutes);
app.use("/upload", uploadRoutes);
app.use(process.env.SUPER_PATH!, superRoutes);
app.use("/api/images", imagesRoute);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connected and synced.");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log("Server is up and running!");
  });
}

start();
