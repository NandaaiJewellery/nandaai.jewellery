import { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const router = Router();
const authService = new AuthService();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.register(name, email, password);

    res.status(201).json(result);
  } catch (err: any) {
    console.error(err);

    if (err.message === "Email already registered") {
      return res.status(400).json({ error: err.message });
    }

    if (err.message.includes("required")) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json(result);
  } catch (err: any) {
    console.error(err);

    if (
      err.message === "Invalid credentials" ||
      err.message.includes("required")
    ) {
      return res.status(
        err.message === "Invalid credentials" ? 401 : 400
      ).json({ error: err.message });
    }

    res.status(500).json({ error: "Login failed" });
  }
});

export default router;