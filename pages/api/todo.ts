import type { NextApiRequest, NextApiResponse } from "next";
import { Todo } from '../../types/todo';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

/* eslint-disable */
let todos: Todo[] = [];
/* eslint-enable */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      todos = await prisma.todo.findMany();
      res.status(200).json(todos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  } else if (req.method === 'POST') {
    const { text } = req.body;
    const newTodo: Todo = await prisma.todo.create({
      data: {
        text: text,
        completed: false
      }
    });
    res.status(200).json(newTodo);
  }
}
