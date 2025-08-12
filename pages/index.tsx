import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { Todo } from '../types/todo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut } from "next-auth/react";

export default function Home() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    const res = await fetch('/api/todo');
    const data: Todo[] = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const onClickAdd = async () => {
    await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ text })
    });
    fetchTodos();
    setText('');
  };

  const onClickDelete = async (id: number) => {
    await fetch('/api/todo', {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchTodos();
  };

  return (
    <>
      <h1>Todoアプリ</h1>
      <button onClick={() => signOut({ callbackUrl: "/auth/signin" })}>ログアウト</button>
      <div>
        <input placeholder="タスクを入力" value={text} onChange={onChange} />
        <button onClick={onClickAdd}>追加</button>
      </div>
      <div>
        <p>未完了のTodoリスト</p>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <p>{todo.text}</p>
              <Link href={`/${todo.id}`}>
                <button>編集</button>
              </Link>
              <button onClick={() => onClickDelete(todo.id)}>削除</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// サーバーサイドでログインチェック
export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("getServerSidePropsが呼ばれました");
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log("SESSION:", session);

  if (!session) {
    console.log("❌ セッションがありません。リダイレクトします。");
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
