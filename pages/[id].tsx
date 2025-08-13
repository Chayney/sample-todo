import { Todo } from "../types/todo";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

export default function EditPage() {
    const router = useRouter();
    const { id } = router.query;
    const [text, setText] = useState('');
    const [todo, setTodo] = useState<Todo>({
        id: 0,
        text: '',
        completed: false,
        userId: 0
    });

    const fetchTodo = async () => {
        const res = await fetch(`api/todo?id=${id}`);
        const data: Todo = await res.json();
        console.log(data);
        setTodo(data);
        setText(data.text);
    }

    useEffect(() => {
        if (!id) return;
        const fetchTodo = async () => {
            const res = await fetch(`api/todo?id=${id}`);
            const data: Todo = await res.json();
            console.log(data);
            setTodo(data);
            setText(data.text);
        }
        fetchTodo();
    }, [id])

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);

    const onClick = async () => {
        if (!todo) return;
        await fetch(`api/todo?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ id: todo.id, text: text, completed: false })
        })
        fetchTodo();
        router.push('/');
    }

    return (
        <>
            <h1>編集画面</h1>
            <div>
                <input placeholder="タスクを入力してください" value={text} onChange={onChange} />
                <button onClick={onClick}>編集完了</button>
            </div>
        </>
    )
}