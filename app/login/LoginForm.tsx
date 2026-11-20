"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./login.module.css";

const ERRORS: Record<string, string> = {
  invalid: "Неверный e-mail или пароль.",
  email_taken: "Этот e-mail уже зарегистрирован. Войдите или продолжите с Google.",
  use_google: "Этот e-mail зарегистрирован через Google — нажмите «Продолжить с Google».",
  invalid_input: "Проверьте данные: имя от 2 символов, корректный e-mail и пароль от 8 символов.",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function LoginForm({ googleEnabled, initialError }: { googleEnabled: boolean; initialError?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError ?? "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        mode,
        name: form.get("name") ?? "",
        email: form.get("email"),
        password: form.get("password"),
        redirect: false,
      });
      if (result?.error) {
        setError(ERRORS[result.code ?? ""] ?? ERRORS.invalid);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Не удалось связаться с сайтом. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.authBox}>
      <div className={styles.tabs} role="tablist">
        <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? styles.tabActive : ""} onClick={() => { setMode("login"); setError(""); }}>Вход</button>
        <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? styles.tabActive : ""} onClick={() => { setMode("register"); setError(""); }}>Регистрация</button>
      </div>

      <form className={styles.form} onSubmit={submit}>
        {mode === "register" && <label>Имя<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>}
        <label>E-mail<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
        <label>Пароль<input name="password" type="password" required minLength={8} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} />{mode === "register" && <span className={styles.hint}>Не меньше 8 символов</span>}</label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" className={styles.submitButton} disabled={busy}>{busy ? "Подождите…" : mode === "login" ? "Войти" : "Создать аккаунт"}</button>
      </form>

      {googleEnabled && <>
        <div className={styles.divider}><span>или</span></div>
        <button className={styles.googleButton} type="button" onClick={() => void signIn("google", { redirectTo: "/" })}>
          <GoogleIcon /> Продолжить с Google
        </button>
      </>}
    </div>
  );
}
