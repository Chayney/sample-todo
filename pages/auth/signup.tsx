import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
            router.push("/auth/signin");
        } else {
            alert("Error signing up");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">登録</button>
            </form>
            <p>
                アカウントをお持ちの方は
                <Link href="/auth/signin">
                    <span style={{ marginLeft: "0.5em", color: "blue" }}>こちら</span>
                </Link>
                からログインできます。
            </p>
        </>
    );
}
