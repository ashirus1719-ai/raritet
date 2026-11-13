"use client";

import { useState, useEffect } from "react";
import { translations, type Locale } from "@/lib/i18n";

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'ru' || saved === 'ky' || saved === 'en')) {
      setLocale(saved);
    }

    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setLocale(customEvent.detail);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  const t = (key: keyof typeof translations.ru): string => {
    return translations[locale]?.[key] || translations.ru[key] || key;
  };

  return { t, locale };
}
