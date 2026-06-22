import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        role: string;
        token: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            role: boolean;
            token: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: boolean;
        accessToken?: string;
    }
}