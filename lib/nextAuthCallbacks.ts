import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";

interface CustomJWT extends JWT {
    userId?: number;
}

export async function jwtCallback({
    token,
    user,
}: {
    token: CustomJWT;
    user?: User;
}): Promise<CustomJWT> {
    if (user && user.id) {
        // user.id が string か number か判定して number に変換
        token.userId = typeof user.id === "string" ? parseInt(user.id) : user.id;
    }
    return token;
}
