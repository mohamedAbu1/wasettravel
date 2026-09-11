/* eslint-disable react-hooks/set-state-in-effect */
// context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en"); // الافتراضي
  const pathname = usePathname();
  const { i18n } = useTranslation();

  useEffect(() => {
    const requestedLocale = pathname?.split("/").filter(Boolean)[0];
    const supported = ["en", "es", "fr", "de", "it", "zh"];
    const nextLang = supported.includes(requestedLocale)
      ? requestedLocale
      : (navigator.language || "en").split("-")[0];
    const normalizedI18nLanguage = nextLang === "zh" ? "zh-CN" : nextLang;

    setLang(nextLang);
    if (i18n.language !== normalizedI18nLanguage) {
      i18n.changeLanguage(normalizedI18nLanguage);
    }
    document.documentElement.lang = nextLang;
  }, [pathname, i18n]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
