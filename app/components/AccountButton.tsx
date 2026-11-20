"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Shield } from "lucide-react";
import styles from "./AccountButton.module.css";

type SessionUser = { name?: string | null; email?: string | null; image?: string | null; role?: string };

/** Header account control: «Войти» for guests, avatar with a menu once signed in. */
export default function AccountButton() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((session) => { if (active) setUser(session?.user ?? null); })
      .catch(() => { if (active) setUser(null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (user === undefined) return <span className={`header-sign-in ${styles.pending}`} aria-hidden="true">Войти</span>;
  if (!user) return <Link className="header-sign-in" href="/login">Войти</Link>;

  const label = user.name || user.email || "Аккаунт";
  const initial = label.trim().charAt(0).toUpperCase();

  return (
    <div className={styles.root} ref={rootRef}>
      <button type="button" className={styles.avatarButton} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" aria-label={`Аккаунт: ${label}`}>
        {user.image
          ? <img src={user.image} alt="" referrerPolicy="no-referrer" />
          : <span>{initial}</span>}
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.who}>
            <strong>{user.name || "Ваш аккаунт"}</strong>
            {user.email && <span>{user.email}</span>}
          </div>
          {user.role === "admin" && <Link role="menuitem" href="/admin" className={styles.item} onClick={() => setOpen(false)}><Shield size={16} aria-hidden="true" /> Админ-панель</Link>}
          <button role="menuitem" type="button" className={styles.item} onClick={() => void signOut({ redirectTo: "/" })}><LogOut size={16} aria-hidden="true" /> Выйти</button>
        </div>
      )}
    </div>
  );
}
