import { Request, Response } from "express";
import { signToken, getPublicKey } from "../utils/jwt.utils";

interface LoginBody {
  email?: string;
  password?: string;
}

const MOCK_USER = {
  id: "user-001",
  email: "user@example.com",
  password: "password123",
};

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const accessToken = signToken({
    userId: MOCK_USER.id,
    email: MOCK_USER.email,
  });
  res.json({ accessToken });
}

export async function publicKey(_req: Request, res: Response): Promise<void> {
  const key = getPublicKey();
  res.json({ publicKey: key });
}
