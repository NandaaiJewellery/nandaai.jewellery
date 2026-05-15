import { api } from "./client";
import type { AuthResponse } from "@/types";

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/register", { name, email, password });
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/login", { email, password });
}
