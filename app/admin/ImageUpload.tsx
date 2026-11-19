"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import s from "./admin.module.css";

// Поле «картинка»: можно вставить ссылку/путь или загрузить файл с компьютера.
export default function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) onChange(data.url);
      else setError(data.error ?? "Ошибка загрузки");
    } catch {
      setError("Ошибка соединения");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className={s.upload}>
      <span>{label}</span>
      <div className={s.uploadRow}>
        {value ? <img src={value} alt="" className={s.uploadPreview} /> : <span className={s.uploadPreview} />}
        <input className={s.input} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Ссылка или путь /images/..." />
        <button type="button" className={s.btnGhost} disabled={busy} onClick={() => input.current?.click()}>
          {busy ? <Loader2 className={s.spinIcon} /> : <ImagePlus />}{busy ? "Загрузка…" : "Загрузить"}
        </button>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </div>
      {error && <span className={s.uploadError}>{error}</span>}
    </div>
  );
}
