"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, BookMarked, Building2, CheckCircle2, ExternalLink, EyeOff, Home, Lock, LogOut, MapPin, PackageX, Pencil, Phone, Plus, Search, Star, Trash2, X, ShoppingBag, Users } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import BookCover from "../components/BookCover";
import ContentEditor from "./ContentEditor";
import ImageUpload from "./ImageUpload";
import AdminOrdersPanel from "./AdminOrdersPanel";
import AdminUsersPanel from "./AdminUsersPanel";
import s from "./admin.module.css";

type Book = {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  description: string;
  publisher: string | null;
  publicationYear: number | null;
  pages: number | null;
  language: string | null;
  binding: string | null;
  isbn: string | null;
  category: string;
  priceKgs: number;
  oldPriceKgs: number | null;
  stock: number | null;
  coverUrl: string | null;
  coverTone: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
};

type Tab = "books" | "home" | "about" | "stores" | "contacts" | "orders" | "users";

const TONES: [string, string][] = [["forest", "Лесной зелёный"], ["terracotta", "Терракота"], ["indigo", "Индиго"], ["plum", "Слива"], ["ochre", "Охра"], ["sage", "Шалфей"]];
const empty: Partial<Book> = { slug: "", title: "", author: "", description: "", publisher: "", category: "Без категории", priceKgs: 0, coverTone: "forest", isFeatured: false, isPublished: true, sortOrder: 100 };

const NAV: { key: Tab; label: string; Icon: React.ComponentType; title: string; subtitle: string }[] = [
  { key: "books", label: "Книги", Icon: BookOpen, title: "Каталог книг", subtitle: "Добавляйте, редактируйте и публикуйте издания" },
  { key: "home", label: "Главная", Icon: Home, title: "Главная страница", subtitle: "Тексты первого экрана и блоков главной" },
  { key: "about", label: "О компании", Icon: Building2, title: "О компании", subtitle: "Описание и показатели — например «25+ лет с вами»" },
  { key: "stores", label: "Магазины", Icon: MapPin, title: "Магазины", subtitle: "Адреса, часы работы, телефоны и фото заведений" },
  { key: "contacts", label: "Контакты", Icon: Phone, title: "Контакты", subtitle: "Телефон, почта и соцсети в футере сайта" },
  { key: "orders", label: "Заказы", Icon: ShoppingBag, title: "Оплаченные заказы", subtitle: "Новые оплаты появляются здесь автоматически" },
  { key: "users", label: "Пользователи", Icon: Users, title: "Пользователи", subtitle: "Поиск пользователей и управление правами администраторов" },
];

const slugify = (t: string) => {
  const map: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ы: "y", э: "e", ю: "yu", я: "ya", ү: "u", ө: "o", ң: "n" };
  return t.toLowerCase().split("").map((c) => map[c] ?? c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

export default function AdminPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [googleConfigured, setGoogleConfigured] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [editing, setEditing] = useState<Partial<Book> | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "hidden" | "featured">("all");
  const [tab, setTab] = useState<Tab>("books");
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);

  const notify = useCallback((text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/raritet-books", { cache: "no-store" });
    if (res.status === 401) return setAuth(false);
    const data = await res.json();
    setBooks(data.books ?? []);
    setAuth(true);
  }, []);

  // Раздел запоминается в адресе (?tab=about), чтобы можно было обновить страницу и остаться в нём.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab") as Tab | null;
    if (t && NAV.some((n) => n.key === t)) setTab(t);
  }, []);
  const openTab = (t: Tab) => {
    setTab(t);
    window.history.replaceState(null, "", t === "books" ? "/admin" : `/admin?tab=${t}`);
  };

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { setGoogleConfigured(Boolean(d.googleConfigured)); if (d.authenticated) void load(); else setAuth(false); })
      .catch(() => setAuth(false));
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const isNew = !editing.id;
    const payload = { ...editing, slug: editing.slug || slugify(editing.title ?? "") };
    const res = await fetch("/api/admin/raritet-books", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditing(null);
      notify(isNew ? "Книга добавлена" : "Изменения сохранены");
      load();
    } else {
      notify("Ошибка сохранения — проверьте, что адрес (slug) уникален", true);
    }
  };

  const remove = async (b: Book) => {
    if (!confirm(`Удалить «${b.title}»?`)) return;
    const res = await fetch(`/api/admin/raritet-books?id=${b.id}`, { method: "DELETE" });
    notify(res.ok ? "Книга удалена" : "Не удалось удалить", !res.ok);
    load();
  };

  const logout = async () => { await signOut({ redirectTo: "/" }); };

  const set = (k: keyof Book, v: unknown) => setEditing((p) => ({ ...p, [k]: v }));
  const field = (k: keyof Book, label: string, type = "text", placeholder?: string) => (
    <label className={s.field}>{label}
      <input className={s.input} type={type} placeholder={placeholder} value={(editing?.[k] as string | number | null) ?? ""} onChange={(e) => set(k, e.target.value)} />
    </label>
  );

  if (auth === null) return <main className={s.center}><div className={s.spinner} /></main>;
  if (auth === false) {
    return (
      <main className={s.center}>
        <div className={s.lockCard}>
          <Lock />
          <h1>Админка «Раритет»</h1>
          <h2>Вход для команды</h2>
          <p>Войдите через Google. Доступ к панели управления есть только у пользователей с правами администратора.</p>
          {!googleConfigured && <p className={s.errorText}>Вход через Google пока не настроен. Добавьте OAuth ключи в переменные окружения проекта.</p>}
          <button className={s.btn} disabled={!googleConfigured} onClick={() => void signIn("google", { redirectTo: "/admin" })}>Продолжить с Google</button>
          <Link href="/" className={s.loginHome}>На главную</Link>
        </div>
      </main>
    );
  }

  const current = NAV.find((n) => n.key === tab)!;
  const q = query.toLowerCase();
  const shown = books
    .filter((b) => filter === "all" || (filter === "published" && b.isPublished) || (filter === "hidden" && !b.isPublished) || (filter === "featured" && b.isFeatured))
    .filter((b) => `${b.title} ${b.author ?? ""} ${b.category}`.toLowerCase().includes(q));
  const published = books.filter((b) => b.isPublished).length;
  const featured = books.filter((b) => b.isFeatured).length;
  const outOfStock = books.filter((b) => b.stock === 0).length;

  return (
    <div className={s.shell}>
      <aside className={s.sidebar}>
        <Link href="/" className={s.brand}><BookMarked size={30} /><div><b>РАРИТЕТ</b><small>панель управления</small></div></Link>
        <p className={s.navLabel}>Разделы</p>
        {NAV.map(({ key, label, Icon }) => (
          <button key={key} className={`${s.navItem} ${tab === key ? s.navItemActive : ""}`} onClick={() => openTab(key)}>
            <Icon /><span>{label}</span>{key === "books" && <em className={s.navCount}>{books.length}</em>}
          </button>
        ))}
        <div className={s.sidebarFoot}>
          <Link href="/" target="_blank" className={s.btnSide}><ExternalLink /><span>Открыть сайт</span></Link>
          <button className={s.btnSide} onClick={logout}><LogOut /><span>Выйти</span></button>
        </div>
      </aside>

      <main className={s.main}>
        <header className={s.pageHead}>
          <div>
            <p className={s.eyebrow}><i />✦ ПАНЕЛЬ УПРАВЛЕНИЯ</p>
            <h1 className={s.title}>{current.title}</h1>
            <p className={s.subtitle}>{current.subtitle}</p>
          </div>
          {tab === "books" && <button className={s.btn} onClick={() => setEditing({ ...empty })}><Plus />Добавить книгу</button>}
        </header>

        {["home", "about", "stores", "contacts"].includes(tab) && <ContentEditor key={tab} section={tab as "home" | "about" | "stores" | "contacts"} notify={notify} />}
        {tab === "orders" && <AdminOrdersPanel />}
        {tab === "users" && <AdminUsersPanel />}

        {tab === "books" && <>
          <div className={s.stats}>
            <div className={`${s.stat} ${s.statDark}`}><BookOpen /><strong>{books.length}</strong><span>всего книг</span></div>
            <div className={s.stat}><CheckCircle2 /><strong>{published}</strong><span>опубликовано</span></div>
            <div className={s.stat}><Star /><strong>{featured}</strong><span>избранных</span></div>
            <div className={s.stat}><PackageX /><strong>{outOfStock}</strong><span>нет в наличии</span></div>
          </div>

          <div className={s.toolbar}>
            <div className={s.search}><Search /><input className={s.input} placeholder="Поиск по названию, автору, категории" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
            <div className={s.chips}>
              {([["all", "Все"], ["published", "Опубликованные"], ["hidden", "Скрытые"], ["featured", "Избранные"]] as const).map(([k, l]) => (
                <button key={k} className={`${s.chip} ${filter === k ? s.chipActive : ""}`} onClick={() => setFilter(k)}>{l}</button>
              ))}
            </div>
          </div>

          {shown.length === 0
            ? <div className={s.empty}>{books.length === 0 ? "Пока нет ни одной книги — добавьте первую" : "Ничего не найдено"}</div>
            : <div className={s.bookGrid}>
                {shown.map((b) => (
                  <article key={b.id} className={s.bookCard}>
                    <div className={s.cover}><BookCover title={b.title} author={b.author} tone={b.coverTone} image={b.coverUrl} compact /></div>
                    <div className={s.bookBody}>
                      <h3>{b.title}</h3>
                      <p>{b.author ?? "Автор не указан"} · {b.category}</p>
                      <div className={s.bookMeta}>
                        <span className={s.price}>{b.priceKgs.toLocaleString("ru-RU")} сом</span>
                        {b.oldPriceKgs ? <span className={s.oldPrice}>{b.oldPriceKgs.toLocaleString("ru-RU")}</span> : null}
                      </div>
                      <div className={s.bookMeta}>
                        {b.isPublished ? <span className={`${s.badge} ${s.badgeOn}`}><CheckCircle2 />На сайте</span> : <span className={`${s.badge} ${s.badgeOff}`}><EyeOff />Скрыта</span>}
                        {b.isFeatured && <span className={`${s.badge} ${s.badgeGold}`}><Star />Избранная</span>}
                        {b.stock === 0 && <span className={`${s.badge} ${s.badgeWarn}`}>Нет в наличии</span>}
                        {b.stock ? <span className={`${s.badge} ${s.badgeOff}`}>{b.stock} шт.</span> : null}
                      </div>
                      <div className={s.bookActions}>
                        <button className={s.btnGhost} onClick={() => setEditing(b)}><Pencil />Изменить</button>
                        <button className={s.btnDanger} onClick={() => remove(b)}><Trash2 /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>}
        </>}
      </main>

      {editing && (
        <div className={s.overlay} onClick={() => setEditing(null)}>
          <form className={s.modal} onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className={s.modalHead}>
              <BookOpen />
              <h2>{editing.id ? "Редактирование книги" : "Новая книга"}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Закрыть"><X size={18} /></button>
            </div>
            <div className={s.modalBody}>
              <p className={s.sectionLabel}>Основное</p>
              <div className={s.grid2}>
                {field("title", "Название *")}
                {field("author", "Автор")}
              </div>
              <label className={s.field}>Описание
                <textarea className={s.input} rows={4} value={editing.description ?? ""} onChange={(e) => set("description", e.target.value)} />
              </label>
              <div className={s.grid2}>
                {field("category", "Категория")}
                {field("slug", "Адрес страницы (slug)", "text", editing.title ? slugify(editing.title) : "создаётся из названия")}
              </div>

              <p className={s.sectionLabel}>Цена и наличие</p>
              <div className={s.grid3}>
                {field("priceKgs", "Цена, сом *", "number")}
                {field("oldPriceKgs", "Старая цена", "number")}
                {field("stock", "В наличии, шт.", "number")}
              </div>

              <p className={s.sectionLabel}>Издание</p>
              <div className={s.grid3}>
                {field("publisher", "Издательство")}
                {field("publicationYear", "Год", "number")}
                {field("pages", "Страниц", "number")}
                {field("language", "Язык")}
                {field("binding", "Переплёт")}
                {field("isbn", "ISBN")}
              </div>

              <p className={s.sectionLabel}>Оформление</p>
              <ImageUpload label="Обложка" value={editing.coverUrl ?? ""} onChange={(v) => set("coverUrl", v)} />
              <div className={s.grid2}>
                <label className={s.field}>Цвет обложки (если нет фото)
                  <select className={s.input} value={editing.coverTone ?? "forest"} onChange={(e) => set("coverTone", e.target.value)}>
                    {TONES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
                {field("sortOrder", "Порядок (меньше — выше)", "number")}
              </div>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                <label className={s.check}><input type="checkbox" checked={!!editing.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> Показывать на сайте</label>
                <label className={s.check}><input type="checkbox" checked={!!editing.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} /> Избранная</label>
              </div>
            </div>
            <div className={s.modalFoot}>
              <button type="button" className={s.btnGhost} onClick={() => setEditing(null)}>Отмена</button>
              <button className={s.btn}>Сохранить</button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className={`${s.toast} ${toast.error ? s.toastError : ""}`}><CheckCircle2 />{toast.text}</div>}
    </div>
  );
}
