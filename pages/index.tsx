import { Todo } from '../types/todo';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    const res = await fetch('/api/todo');
    const data: Todo[] = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);

  return (
    <>
      <h1>Todoアプリ</h1>
      <div>
        <input placeholder='タスクを入力' value={text} onChange={onChange} />
        <button>追加</button>
      </div>
      <div>
        <p>未完了のTodoリスト</p>
        <ul>
          {todos.map((todo) => {
            return (
              <li key={todo.id}>
                <p>{todo.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
      <Link href={'/'}>
        <button>編集</button>
      </Link>
    </>
  );
}
