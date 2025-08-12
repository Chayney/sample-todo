console.log("NextAuth API route loaded");
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "../../../prisma/generated/prisma";
import bcrypt from "bcrypt";
import { jwtCallback } from "../../../lib/nextAuthCallbacks";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Authorize called", credentials);
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                console.log("Found user:", user);

                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                console.log("Password valid:", isValid);

                if (!isValid) return null;

                console.log("✅ Login success, returning user object");

                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    debug: true,
    logger: {
        error(code, ...rest) {
            console.error(code, ...rest);
        },
        warn(code, ...rest) {
            console.warn(code, ...rest);
        },
        debug(code, ...rest) {
            console.debug(code, ...rest);
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: jwtCallback,
        session({ session, token }) {
            if (session.user && "userId" in token && typeof token.userId === "number") {
                session.user.id = token.userId;
            } else if (typeof token.userId === "string") {
                session.user.id = parseInt(token.userId, 10);
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
};

export default NextAuth(authOptions);
