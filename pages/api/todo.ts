import type { NextApiRequest, NextApiResponse } from "next";
import { Todo } from '../../types/todo';

let todos: Todo[] = [{
  id: 0,
  text: '',
  completed: false
}];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    res.status(200).json(todos);
  }
}
