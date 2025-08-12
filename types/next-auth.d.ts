import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number; // number型で上書き
            name?: string | null;
            email?: string | null;
            password?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: number; // JWTに保存する用
    }
}
