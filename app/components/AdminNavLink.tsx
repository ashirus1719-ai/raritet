"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** «Панель» item in the main header menu, shown only to administrators. The /admin page itself checks access on the server. */
export default function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((session) => { if (active) setIsAdmin(session?.user?.role === "admin"); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  if (!isAdmin) return null;
  return <Link href="/admin" className="nav-admin">Панель</Link>;
}
