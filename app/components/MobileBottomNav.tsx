"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Building2, House, MapPin, Phone } from "lucide-react";

const items = [
  { label: "Главная", href: "/", Icon: House },
  { label: "Каталог", href: "/books", Icon: BookOpen },
  { label: "О нас", href: "/about", Icon: Building2 },
  { label: "Магазины", href: "/stores", Icon: MapPin },
  { label: "Контакты", href: "/#contacts", Icon: Phone },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
      {items.map(({ label, href, Icon }) => {
        const active = href === "/#contacts"
          ? pathname === "/" && hash === "#contacts"
          : pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

        return (
          <Link key={href} href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
            <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
