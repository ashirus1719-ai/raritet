"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default function AdminHotkey() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => { if (active) setIsAdmin(data.isAdmin === true); })
      .catch(() => { if (active) setIsAdmin(false); });
    return () => { active = false; };
  }, []);

  // Inside the panel itself the shortcut is pointless and would cover the save bar.
  if (!isAdmin || pathname.startsWith("/admin")) return null;

  return (
    <Link
      href="/admin"
      aria-label="Открыть панель управления"
      style={{ position: "fixed", right: 16, bottom: "calc(86px + env(safe-area-inset-bottom))", zIndex: 45, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 15px", border: "1px solid #c6a879", borderRadius: 999, background: "#102e20", color: "#fff9ee", boxShadow: "0 8px 22px #10261a44", fontSize: 13, fontWeight: 600 }}
    >
      <LayoutDashboard size={16} /> Панель управления
    </Link>
  );
}
