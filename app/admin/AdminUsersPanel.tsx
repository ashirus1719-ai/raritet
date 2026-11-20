"use client";

import { useCallback, useEffect, useState } from "react";
import { Crown, Search, ShieldCheck, UserRound, UserRoundCog } from "lucide-react";
import s from "./admin.module.css";

type User = { id: string; name: string | null; email: string | null; image: string | null; role: string; createdAt: string; isOwner: boolean };

export default function AdminUsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [canManageRoles, setCanManageRoles] = useState(false);
  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить пользователей");
      setUsers(data.users ?? []); setCanManageRoles(data.canManageRoles === true); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка загрузки"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = setTimeout(() => void load(query), 250); return () => clearTimeout(timer); }, [load, query]);
  const changeRole = async (user: User) => {
    const role = user.role === "admin" ? "user" : "admin";
    setBusy(user.id); setError("");
    try {
      const response = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, role }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось изменить права");
      await load(query);
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка изменения прав"); }
    finally { setBusy(null); }
  };
  return <section className={s.panel}>
    <div className={s.panelHead}><span className={s.panelIcon}><UserRoundCog /></span><div><h3>Пользователи</h3><p>{canManageRoles ? "Вы владелец: только вы выдаёте и снимаете права администратора" : "Выдавать права администратора может только владелец сайта"}</p></div></div>
    <div className={s.panelBody}>
      <label className={`${s.search} ${s.userSearch}`}><Search /><input className={s.input} placeholder="Поиск по имени или email" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
      {error && <p className={s.errorText}>{error}</p>}
      {loading ? <p className={s.empty}>Загружаем пользователей…</p> : users.length === 0 ? <p className={s.empty}>Пользователей не найдено. Они появятся после регистрации или входа через Google.</p> : <div className={s.userList}>{users.map((user) => <article className={s.userCard} key={user.id}>
        <div className={s.userAvatar}>{user.image ? <img src={user.image} alt="" /> : <UserRound />}</div>
        <div className={s.userInfo}><strong>{user.name || "Без имени"}</strong><span>{user.email || "Нет email"}</span><small>В системе с {new Date(user.createdAt).toLocaleDateString("ru-RU")}</small></div>
        <span className={`${s.roleBadge} ${user.role === "admin" ? s.roleAdmin : ""}`}>{user.isOwner ? <><Crown /> Владелец</> : user.role === "admin" ? <><ShieldCheck /> Администратор</> : "Пользователь"}</span>
        {canManageRoles && !user.isOwner && <button className={user.role === "admin" ? s.btnDanger : s.btnGhost} disabled={busy === user.id} onClick={() => void changeRole(user)}>{busy === user.id ? "Сохраняем…" : user.role === "admin" ? "Снять права" : "Сделать админом"}</button>}
      </article>)}</div>}
    </div>
  </section>;
}
