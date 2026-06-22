import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { verifyUserData } from ".";
import { redirect } from "next/navigation";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                try {
                    const res = await fetch(
                        `${process.env.SUPER_BASE}/${process.env.SUPER_TOKEN}`,
                        { method: "GET" }
                    );

                    if (!res.ok) {
                        console.error("Failed to fetch users");
                        return null;
                    }

                    return await verifyUserData(res, credentials);
                } catch (err) {
                    console.error("Auth error:", err);
                    return null;
                }
            }
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60 // 1 day
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = Boolean(user.role);
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role!;
                session.user.token = token.accessToken as string;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export async function requireAuth() {
    const session = await getServerSession(authOptions);

    if (
        !session
        || !session.user.role
        || session.user.token !== process.env.SUPER_TOKEN
    ) redirect("/login");
    return session;
}