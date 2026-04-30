import { Router, Request, Response } from "express";
import { Wishlist, Product } from "../models";
import { authMiddleware } from "../middleware/auth";
import type { JwtPayload } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as Request & { user: JwtPayload }).user;
    const items = await Wishlist.findAll({
      where: { userId: user.userId },
      order: [["created_at", "DESC"]],
      include: [Product],
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

router.post("/add", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as Request & { user: JwtPayload }).user;
    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ error: "productId is required" });
      return;
    }
    const [item] = await Wishlist.findOrCreate({
      where: { userId: user.userId, productId },
      defaults: { userId: user.userId, productId },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

router.delete(
  "/:itemId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as Request & { user: JwtPayload }).user;
      const itemId = parseInt(req.params.itemId, 10);
      const deleted = await Wishlist.destroy({
        where: { id: itemId, userId: user.userId },
      });
      if (deleted === 0) {
        res.status(404).json({ error: "Wishlist item not found" });
        return;
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  }
);

export default router;
