import Link from "next/link";
import { BookOpen } from "lucide-react";
import { auth, signOut } from "@/auth";
import GoogleSignInButton from "./GoogleSignInButton";
import styles from "./login.module.css";

export default async function LoginPage() {
  const session = await auth();
  const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link className={styles.brand} href="/" aria-label="Раритет — главная">
          <BookOpen size={34} strokeWidth={1.6} />
          <span>РАРИТЕТ</span>
        </Link>

        {session?.user ? (
          <>
            <p className={styles.eyebrow}>Личный кабинет</p>
            <h1>Вы уже вошли</h1>
            <p className={styles.description}>{session.user.name || session.user.email}</p>
            <Link className={styles.primaryLink} href={session.user.role === "admin" ? "/admin" : "/"}>
              {session.user.role === "admin" ? "Перейти в админку" : "На главную"}
            </Link>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <button type="submit" className={styles.signOutButton}>Выйти из аккаунта</button>
            </form>
          </>
        ) : (
          <>
            <p className={styles.eyebrow}>Личный кабинет</p>
            <h1>Войти или зарегистрироваться</h1>
            <p className={styles.description}>
              Продолжите с Google. Если вы здесь впервые, мы создадим обычный аккаунт пользователя.
            </p>
            {googleConfigured ? (
              <GoogleSignInButton />
            ) : (
              <p className={styles.notice}>Вход через Google пока не настроен.</p>
            )}
          </>
        )}

        <p className={styles.note}>Права администратора выдаются отдельно через список пользователей в админке.</p>
        <p className={styles.note}>Продолжая с Google, вы соглашаетесь с <Link href="/privacy">Политикой конфиденциальности</Link> и <Link href="/terms">Условиями использования</Link>.</p>
        <Link className={styles.backLink} href="/">Вернуться на сайт</Link>
      </section>
    </main>
  );
}
