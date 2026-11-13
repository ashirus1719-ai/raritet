"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('ru');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && locales.includes(saved)) {
      setCurrentLocale(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const changeLocale = (locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('localeChange', { detail: locale }));
  };

  return (
    <div className="language-switcher">
      <button 
        className="language-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Выбрать язык"
      >
        <Globe size={16} />
        <span>{localeNames[currentLocale]}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => changeLocale(locale)}
              className={currentLocale === locale ? 'active' : ''}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .language-switcher {
          position: relative;
        }

        .language-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #e2e8e0;
          border-radius: 8px;
          background: #fff;
          color: #214c40;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .language-button:hover {
          border-color: #214c40;
          background: #f9faf8;
        }

        .language-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 140px;
          background: #fff;
          border: 1px solid #e2e8e0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(28, 67, 48, 0.12);
          overflow: hidden;
          z-index: 100;
        }

        .language-dropdown button {
          display: block;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          font-size: 12px;
          color: #3f5549;
          cursor: pointer;
          transition: background 0.2s;
        }

        .language-dropdown button:hover {
          background: #f4f7f2;
        }

        .language-dropdown button.active {
          background: #edf2ec;
          color: #214c40;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .language-button span {
            display: none;
          }
          
          .language-button {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
}
