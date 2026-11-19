"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Ctrl+Shift+U открывает окно ввода пароля администратора.
export default function AdminHotkey() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyU") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setPassword("");
      setError("");
      setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setOpen(false);
        router.push("/admin");
      } else {
        setError("Неверный пароль");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(16,46,32,.55)", display: "grid", placeItems: "center", padding: 16 }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: "min(340px,100%)", background: "#fff6e6", border: "1px solid #c6a879", borderRadius: 18, padding: 22, display: "grid", gap: 12, boxShadow: "0 12px 30px #0004", color: "#142f21" }}>
        <strong style={{ fontSize: 18 }}>Вход в админку</strong>
        <input ref={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" autoComplete="current-password" style={{ padding: "11px 13px", borderRadius: 10, border: "1px solid #d9c29b", background: "#fff", fontSize: 16 }} />
        {error && <span style={{ color: "#a12b2b", fontSize: 13 }}>{error}</span>}
        <button disabled={busy || !password} style={{ padding: "11px 14px", borderRadius: 999, border: 0, background: "#123b2a", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: busy || !password ? 0.6 : 1 }}>{busy ? "Проверяю…" : "Войти"}</button>
      </form>
    </div>
  );
}
