import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../prisma/generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { Todo } from "../../types/todo";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 認証セッション取得
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;

  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      // 自分のTodo一覧を取得
      const todos = await prisma.todo.findMany({
        where: { userId },
        orderBy: { id: "desc" },
      });
      return res.status(200).json(todos);
    } else {
      const todoId = Number(id);
      const todo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      if (!todo || todo.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.status(200).json(todo);
    }
  }

  else if (req.method === "POST") {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const newTodo: Todo = await prisma.todo.create({
      data: {
        text,
        completed: false,
        userId,
      },
    });

    return res.status(200).json(newTodo);
  }

  else if (req.method === "PUT") {
    const { id, text, completed } = req.body;
    const todoId = Number(id);

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo || todo.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        ...(text !== undefined ? { text } : {}),
        completed,
      },
    });

    return res.status(200).json(updatedTodo);
  }

  else if (req.method === "DELETE") {
    const { id } = req.body;
    const todoId = Number(id);

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo || todo.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.todo.delete({
      where: { id: todoId },
    });

    return res.status(204).end();
  }

  // その他のHTTPメソッド
  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
