import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../../prisma/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") return res.status(405).end();

    const { name, email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    res.status(201).json({ message: "User created" });
}
