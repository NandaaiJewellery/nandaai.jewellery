import express, { Application } from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import productCategoryRoutes from "./routes/productCategories";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import orderRoutes from "./routes/orders";
import imagesRoute from "./routes/images";
import dev from "./utils";

export class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeHealthCheck();
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeRoutes() {
        this.app.use("/auth", authRoutes);
        this.app.use("/products", productRoutes);
        this.app.use("/catalogue", productCategoryRoutes);
        this.app.use("/cart", cartRoutes);
        this.app.use("/wishlist", wishlistRoutes);
        this.app.use("/orders", orderRoutes);
        this.app.use("/api/images", imagesRoute);
    }

    private initializeHealthCheck() {
        this.app.get("/health", (_req, res) => {
            res.json({ status: "ok" });
        });
    }

    public listen(port: number | string) {
        this.app.listen(port, () => {
            if (dev) console.log(`Server is running on port ${port}`);
        });
    }
}

export default new Server();