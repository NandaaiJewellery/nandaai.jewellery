import { Router, Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ProductSortOption } from "../types/Product";

const router = Router();
const productService = new ProductService();


router.get("/", async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const sort = (req.query.sort as ProductSortOption) || "popularity";

    const products = await productService.getProducts(category, sort);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      res.json(null);
      return;
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;