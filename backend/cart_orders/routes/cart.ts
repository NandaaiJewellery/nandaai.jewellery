import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import type { JwtPayload } from "../middleware/auth";

import { CartRepository } from "../repositories/cart.repository";
import { CartService } from "../services/cart.service";

const router = Router();
router.use(authMiddleware);

// Dependency Injection
const cartService = new CartService(new CartRepository());

router.get("/", async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user: JwtPayload }).user;

    const items = await cartService.getUserCart(user.userId);

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

router.post("/add", async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user: JwtPayload }).user;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ error: "productId is required" });
      return;
    }

    const item = await cartService.addToCart(
      user.userId,
      productId,
      quantity
    );

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

router.delete("/:itemId", async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user: JwtPayload }).user;
    const itemId = parseInt(req.params.itemId, 10);

    await cartService.removeFromCart(user.userId, itemId);

    res.status(204).send();
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

export default router;