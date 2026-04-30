import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import type { JwtPayload } from "../middleware/auth";
import { OrderService } from "../services/order.service";

const router = Router();
const orderService = new OrderService();

router.use(authMiddleware);

router.post("/create", async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user: JwtPayload }).user;
    const { total_amount, items } = req.body;

    const order = await orderService.createOrder(
      user.userId,
      Number(total_amount),
      items
    );

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user: JwtPayload }).user;

    const orders = await orderService.getUserOrders(user.userId);

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;