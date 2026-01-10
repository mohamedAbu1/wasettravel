// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// استدعاء ملفات JSON
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";
import de from "./locales/de/translation.json";
import it from "./locales/it/translation.json";
import zhCN from "./locales/zh/translation.json";

i18n
  .use(LanguageDetector) // يكتشف لغة المتصفح
  .use(initReactI18next) // يربط i18next بـ React
  .init({
    resources: {
      en: { header: en.header },
      es: { header: es.header },
      fr: { header: fr.header },
      de: { header: de.header },
      it: { header: it.header },
      "zh-CN": { header: zhCN.header }
    },
    fallbackLng: "en", // اللغة الافتراضية لو اللغة غير موجودة
    interpolation: { escapeValue: false },
    detection: {
      order: ["navigator", "htmlTag", "cookie", "localStorage", "path", "subdomain"],
      caches: ["cookie"]
    }
  });

export default i18n;
