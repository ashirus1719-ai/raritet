import Link from "next/link";
import { BookOpen } from "lucide-react";
import { auth, signOut } from "@/auth";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

const OAUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "Этот e-mail уже связан с другим способом входа. Войдите тем способом, которым регистрировались.",
  AccessDenied: "Вход отменён или запрещён.",
  Configuration: "Вход временно недоступен. Попробуйте позже или войдите по e-mail.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; callbackUrl?: string }> }) {
  const [session, { error, callbackUrl: rawCallback }] = await Promise.all([auth(), searchParams]);
  // Only same-site paths, so the login page cannot be used to redirect visitors elsewhere.
  const callbackUrl = rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//") && !rawCallback.startsWith("/\\") ? rawCallback : "/";
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
            <p className={styles.description}>По e-mail и паролю или через Google — как удобнее.</p>
            <LoginForm googleEnabled={googleConfigured} callbackUrl={callbackUrl} initialError={error ? OAUTH_ERRORS[error] ?? "Не удалось войти. Попробуйте ещё раз." : undefined} />
          </>
        )}

        <p className={styles.note}>Права администратора выдаются отдельно через список пользователей в админке.</p>
        <p className={styles.note}>Входя или регистрируясь, вы соглашаетесь с <Link href="/privacy">Политикой конфиденциальности</Link> и <Link href="/terms">Условиями использования</Link>.</p>
        <Link className={styles.backLink} href="/">Вернуться на сайт</Link>
      </section>
    </main>
  );
}
