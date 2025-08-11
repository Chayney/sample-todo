import { Todo } from '../types/todo';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    const res = await fetch('/api/todo');
    const data: Todo[] = await res.json();
    console.log(data);
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);

  const onClickAdd = async () => {
    await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ text: text })
    })
    fetchTodos();
    setText('');
  }

  const onClickDelete = async (id: number) => {
    await fetch('/api/todo', {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
    fetchTodos();
  }

  return (
    <>
      <h1>Todoアプリ</h1>
      <div>
        <input placeholder='タスクを入力' value={text} onChange={onChange} />
        <button onClick={onClickAdd}>追加</button>
      </div>
      <div>
        <p>未完了のTodoリスト</p>
        <ul>
          {todos.map((todo) => {
            return (
              <li key={todo.id}>
                <p>{todo.text}</p>
                <Link href={'/'}>
                  <button>編集</button>
                </Link>
                <button onClick={() => onClickDelete(todo.id)}>削除</button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  );
}
