import type { NextApiRequest, NextApiResponse } from "next";
import { Todo } from '../../types/todo';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) {
      const todos = await prisma.todo.findMany();
      res.status(200).json(todos);
    } else {
      const todoId = Number(id);
      const todo = await prisma.todo.findUnique({
        where: { id: todoId }
      });
      res.status(200).json(todo);
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
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const todoId = Number(id);
    await prisma.todo.delete({
      where: {
        id: todoId
      }
    });
    res.status(201).end();
  } else if (req.method === 'PUT') {
    const { id, text, completed } = req.body;
    const todoId = Number(id);
    const todo: Todo = await prisma.todo.update({
      where: {
        id: todoId
      },
      data: {
        text: text,
        completed: completed
      }
    });
    res.status(200).json(todo);
  }
}
