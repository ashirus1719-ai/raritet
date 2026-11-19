"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, BookOpen, Building2, AtSign, Landmark, LayoutTemplate, Mail, MapPin, Mountain, Phone, Plus, Save, Sparkles, Store as StoreIcon, Trash2, Type, Users } from "lucide-react";
import ImageUpload from "./ImageUpload";
import s from "./admin.module.css";
import type { SiteContent, Store } from "@/lib/site-content";

type Key = keyof SiteContent;
type Notify = (text: string, error?: boolean) => void;

const statIcons = { book: BookOpen, users: Users, map: MapPin };

function Panel({ icon: Icon, title, hint, tools, children }: { icon: React.ComponentType; title: string; hint?: string; tools?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={s.panel}>
      <header className={s.panelHead}>
        <span className={s.panelIcon}><Icon /></span>
        <div><h3>{title}</h3>{hint && <p>{hint}</p>}</div>
        {tools && <div className={s.panelTools}>{tools}</div>}
      </header>
      <div className={s.panelBody}>{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, area = false, placeholder }: { label: string; value: string; onChange: (v: string) => void; area?: boolean; placeholder?: string }) {
  return (
    <label className={s.field}>{label}
      {area
        ? <textarea className={s.input} rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input className={s.input} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

export default function ContentEditor({ section, notify }: { section: Key; notify: Notify }) {
  const [data, setData] = useState<SiteContent | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(null);
    setDirty(false);
    fetch("/api/admin/content", { cache: "no-store" }).then((r) => r.json()).then(setData);
  }, [section]);

  if (!data) return <div className={s.empty}>Загрузка…</div>;

  const update = <K extends Key>(k: K, patch: Partial<SiteContent[K]>) => {
    setData({ ...data, [k]: { ...data[k], ...patch } });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: section, value: data[section] }),
    });
    setSaving(false);
    if (res.ok) { setDirty(false); notify("Сохранено — изменения уже на сайте"); }
    else notify("Ошибка сохранения", true);
  };

  let body: React.ReactNode = null;

  if (section === "about") {
    const a = data.about;
    const setStat = (i: number, patch: Partial<(typeof a.stats)[number]>) => update("about", { stats: a.stats.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    body = (
      <>
        <Panel icon={Type} title="Тексты страницы" hint="Заголовок, подзаголовок и описание на странице «О компании»">
          <div className={s.grid2}>
            <Field label="Заголовок" value={a.title} onChange={(v) => update("about", { title: v })} />
            <Field label="Подзаголовок" value={a.subtitle} onChange={(v) => update("about", { subtitle: v })} />
          </div>
          <Field label="Описание" value={a.description} onChange={(v) => update("about", { description: v })} area />
          <Field label="Надпись в карточке" value={a.note} onChange={(v) => update("about", { note: v })} />
        </Panel>
        <Panel icon={Sparkles} title="Показатели" hint="Например «25+ — лет с вами»"
          tools={<button className={s.btnGhost} onClick={() => update("about", { stats: [...a.stats, { icon: "book", value: "", label: "" }] })}><Plus />Добавить</button>}>
          <div className={s.statPreview}>
            {a.stats.map((st, i) => { const I = statIcons[st.icon] ?? BookOpen; return <div key={i}><I /><strong>{st.value || "—"}</strong><span>{st.label}</span></div>; })}
          </div>
          {a.stats.map((st, i) => (
            <div key={i} className={s.statRow}>
              <label className={s.field}>Иконка
                <select className={s.input} value={st.icon} onChange={(e) => setStat(i, { icon: e.target.value as typeof st.icon })}>
                  <option value="book">Книга</option><option value="users">Люди</option><option value="map">Карта</option>
                </select>
              </label>
              <Field label="Значение" value={st.value} onChange={(v) => setStat(i, { value: v })} placeholder="25+" />
              <Field label="Подпись" value={st.label} onChange={(v) => setStat(i, { label: v })} placeholder="лет с вами" />
              <button className={`${s.btnDanger} ${s.iconBtn}`} title="Удалить" onClick={() => update("about", { stats: a.stats.filter((_, j) => j !== i) })}><Trash2 /></button>
            </div>
          ))}
        </Panel>
      </>
    );
  }

  if (section === "stores") {
    const list = data.stores.stores;
    const setStore = (i: number, patch: Partial<Store>) => update("stores", { stores: list.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    const move = (i: number, d: number) => { const n = [...list]; [n[i + d], n[i]] = [n[i], n[i + d]]; update("stores", { stores: n }); };
    body = (
      <>
        <Panel icon={Type} title="Шапка страницы" hint="Текст под заголовком «Наши магазины»">
          <Field label="Описание" value={data.stores.heroDescription} onChange={(v) => update("stores", { heroDescription: v })} />
        </Panel>
        {list.map((st, i) => (
          <Panel key={i} icon={StoreIcon} title={st.name || "Новое заведение"} hint={st.address || "Адрес не указан"}
            tools={<>
              <button className={`${s.btnGhost} ${s.iconBtn}`} disabled={i === 0} title="Выше" onClick={() => move(i, -1)}><ArrowUp /></button>
              <button className={`${s.btnGhost} ${s.iconBtn}`} disabled={i === list.length - 1} title="Ниже" onClick={() => move(i, 1)}><ArrowDown /></button>
              <button className={`${s.btnDanger} ${s.iconBtn}`} title="Удалить" onClick={() => confirm(`Удалить «${st.name}»?`) && update("stores", { stores: list.filter((_, j) => j !== i) })}><Trash2 /></button>
            </>}>
            <div className={s.grid2}>
              <Field label="Название" value={st.name} onChange={(v) => setStore(i, { name: v })} />
              <Field label="Адрес" value={st.address} onChange={(v) => setStore(i, { address: v })} />
              <Field label="Часы работы" value={st.hours} onChange={(v) => setStore(i, { hours: v })} />
              <Field label="Телефон" value={st.phone} onChange={(v) => setStore(i, { phone: v })} />
            </div>
            <Field label="Запрос для Google Maps" value={st.map} onChange={(v) => setStore(i, { map: v })} placeholder="Раритет, ул. Пушкина 78, Бишкек" />
            <ImageUpload label="Фото магазина" value={st.image} onChange={(v) => setStore(i, { image: v })} />
            <label className={s.check}><input type="checkbox" checked={!!st.wide} onChange={(e) => setStore(i, { wide: e.target.checked })} /> Широкая карточка (на всю ширину)</label>
          </Panel>
        ))}
        <button className={s.btnGhost} style={{ justifySelf: "start" }} onClick={() => update("stores", { stores: [...list, { name: "", address: "", hours: "Ежедневно 10:00–19:00", phone: "", image: "/images/store-ala-too.webp", map: "" }] })}><Plus />Добавить заведение</button>
      </>
    );
  }

  if (section === "home") {
    const h = data.home;
    const set = (k: keyof typeof h) => (v: string) => update("home", { [k]: v });
    body = (
      <>
        <Panel icon={LayoutTemplate} title="Первый экран" hint="Enter в заголовке — перенос строки">
          <Field label="Надпись над заголовком" value={h.heroEyebrow} onChange={set("heroEyebrow")} />
          <div className={s.grid2}>
            <Field label="Заголовок" value={h.heroTitle} onChange={set("heroTitle")} area />
            <Field label="Описание" value={h.heroText} onChange={set("heroText")} area />
          </div>
        </Panel>
        <Panel icon={Mountain} title="Книги о Кыргызстане">
          <div className={s.grid2}>
            <Field label="Надпись над заголовком" value={h.countryEyebrow} onChange={set("countryEyebrow")} />
            <Field label="Заголовок" value={h.countryTitle} onChange={set("countryTitle")} />
          </div>
          <Field label="Текст" value={h.countryText} onChange={set("countryText")} area />
        </Panel>
        <Panel icon={Building2} title="О Раритете">
          <div className={s.grid2}>
            <Field label="Надпись над заголовком" value={h.aboutEyebrow} onChange={set("aboutEyebrow")} />
            <Field label="Заголовок" value={h.aboutTitle} onChange={set("aboutTitle")} />
          </div>
          <Field label="Текст" value={h.aboutText} onChange={set("aboutText")} area />
        </Panel>
        <Panel icon={Landmark} title="Баннер музея">
          <Field label="Надпись над заголовком" value={h.museumEyebrow} onChange={set("museumEyebrow")} />
          <div className={s.grid2}>
            <Field label="Заголовок" value={h.museumTitle} onChange={set("museumTitle")} area />
            <Field label="Текст" value={h.museumText} onChange={set("museumText")} area />
          </div>
        </Panel>
        <Panel icon={Type} title="Футер">
          <Field label="Копирайт (© 1992–текущий год подставляется автоматически)" value={h.copyright} onChange={set("copyright")} />
        </Panel>
      </>
    );
  }

  if (section === "contacts") {
    const c = data.contacts;
    body = (
      <Panel icon={Phone} title="Контакты" hint="Показываются в футере главной и страницы «Магазины»">
        <div className={s.grid2}>
          <Field label="Телефон" value={c.phone} onChange={(v) => update("contacts", { phone: v })} />
          <Field label="Email" value={c.email} onChange={(v) => update("contacts", { email: v })} />
        </div>
        <Field label="Instagram (ссылка)" value={c.instagram} onChange={(v) => update("contacts", { instagram: v })} />
        <div className={s.statPreview}>
          <div><Phone /><span>{c.phone}</span></div>
          <div><Mail /><span>{c.email}</span></div>
          <div><AtSign /><span>Instagram</span></div>
        </div>
      </Panel>
    );
  }

  return (
    <div className={s.panelStack}>
      {body}
      <div className={s.saveBar}>
        <span>{dirty ? "Есть несохранённые изменения" : "Все изменения сохранены"}</span>
        <button className={s.btn} disabled={saving || !dirty} onClick={save}><Save />{saving ? "Сохраняю…" : "Сохранить"}</button>
      </div>
    </div>
  );
}
