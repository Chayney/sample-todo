import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { Todo } from '../types/todo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut } from "next-auth/react";
import styles from '../styles/Todo.module.css';

export default function Home() {
  const [text, setText] = useState('');
  const [incompletedTodos, setIncompletedTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const fetchIncompletedTodos = async () => {
    const res = await fetch('/api/todo');
    const data: Todo[] = await res.json();
    const incompleted = data.filter(target => target.completed === false);
    setIncompletedTodos(incompleted);
  };

  const fetchCompletedTodos = async () => {
    const res = await fetch('/api/todo');
    const data: Todo[] = await res.json();
    const completed = data.filter(target => target.completed === true);
    setCompletedTodos(completed);
  };

  useEffect(() => {
    fetchIncompletedTodos();
    fetchCompletedTodos();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const onClickAdd = async () => {
    await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ text })
    });
    fetchIncompletedTodos();
    fetchCompletedTodos();
    setText('');
  };

  const onClickDelete = async (id: number) => {
    await fetch('/api/todo', {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchIncompletedTodos();
    fetchCompletedTodos();
  };

  const onClickComplete = async (id: number) => {
    await fetch('/api/todo', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: id, completed: true })
    });
    fetchIncompletedTodos();
    fetchCompletedTodos();
  }

  const onClickBack = async (id: number) => {
    await fetch('/api/todo', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: id, completed: false })
    });
    fetchIncompletedTodos();
    fetchCompletedTodos();
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Todoアプリ</h1>
      <div className={styles.nameArea}>
        <p>ようこそ!</p>
        <button className={styles.button} onClick={() => signOut({ callbackUrl: "/auth/signin" })}>ログアウト</button>
      </div>
      <div className={styles.inputArea}>
        <input className={styles.input} placeholder="タスクを入力" value={text} onChange={onChange} />
        <button className={styles.button} onClick={onClickAdd}>追加</button>
      </div>
      <div>
        <div className={styles.incompleteArea}>
          <p className={styles.title}>未完了のTodoリスト</p>
          <ul>
            {incompletedTodos.map((todo) => (
              <li key={todo.id}>
                <div className={styles.listRow}>
                  <p>{todo.text}</p>
                  <Link href={`/${todo.id}`}>
                    <button className={styles.button}>編集</button>
                  </Link>
                  <button className={styles.button} onClick={() => onClickComplete(todo.id)}>完了</button>
                  <button className={styles.button} onClick={() => onClickDelete(todo.id)}>削除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.completeArea}>
          <p className={styles.title}>完了のTodoリスト</p>
          <ul>
            {completedTodos.map((todo) => (
              <li key={todo.id}>
                <div className={styles.listRow}>
                  <p>{todo.text}</p>
                  <button className={styles.button} onClick={() => onClickBack(todo.id)}>戻す</button>
                  <button className={styles.button} onClick={() => onClickDelete(todo.id)}>削除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
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
