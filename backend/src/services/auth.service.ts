import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseService } from "./BaseService";
import { User } from "../models";
import { UserRepository } from "../repositories/user.repository";

export class AuthService extends BaseService<User> {
    protected repository: UserRepository;

    constructor() {
        const repo = new UserRepository();
        super(repo);
        this.repository = repo;
    }

    async register(name: string, email: string, password: string) {
        if (!name || !email || !password) {
            throw new Error("Name, email and password are required");
        }

        const existing = await this.repository.findByEmail(email);
        if (existing) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.repository.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = this.generateToken(user.id, user.email);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    async login(email: string, password: string) {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const user = await this.repository.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid credentials");
        }

        const token = this.generateToken(user.id, user.email, user.role);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    // helpers
    private generateToken(userId: number, email: string, role?: string) {
        return jwt.sign(
            { userId, email, role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );
    }

    private sanitizeUser(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}