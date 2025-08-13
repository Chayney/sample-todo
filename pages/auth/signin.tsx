import { getCsrfToken, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Link from "next/link";
import styles from '../../styles/AuthForm.module.css';

type SignInProps = { csrfToken: string | null };

export default function SignIn({ csrfToken }: SignInProps) {
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (form.email as HTMLInputElement).value;
        const password = (form.password as HTMLInputElement).value;

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            // callbackUrlを指定しておけば成功時にそこにリダイレクトも可能
            callbackUrl: "/",
        });

        if (result?.error) {
            setError("ログインに失敗しました。");
        } else if (result?.ok) {
            window.location.href = result.url ?? "/";
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input name="csrfToken" type="hidden" defaultValue={csrfToken ?? undefined} className={styles.input} />
                <label className={styles.label}>Email</label>
                <input name="email" type="email" required className={styles.input} />
                <label className={styles.label}>Password</label>
                <input name="password" type="password" required className={styles.input} />
                <button className={styles.button} type="submit">ログイン</button>
            </form>
            <p className={styles.link}>
                アカウントをお持ちでない方は
                <Link href="/auth/signup">
                    <span className={styles.linkText}>こちら</span>
                </Link>
                から新規登録できます。
            </p>
            {error && <p className={styles.error}>{error}</p>}
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const csrfToken = await getCsrfToken(context);
    return { props: { csrfToken } };
};
