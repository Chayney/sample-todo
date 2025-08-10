import { Todo } from '../types/todo';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [todo, setTodo] = useState<Todo[]>([]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);

  return (
    <>
      <h1>Todoアプリ</h1>
      <div>
        <input placeholder='タスクを入力' onChange={onChange} />
        <button>追加</button>
      </div>
      <Link href={'/'}>
        <button>編集</button>
      </Link>
    </>
  );
}
