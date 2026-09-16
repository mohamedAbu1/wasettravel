"use client";
import { createContext, useContext, useEffect, useState } from "react";
import lightTheme from "@/constants/theme/lightTheme";
import darkTheme from "@/constants/theme/darkTheme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("dark");
  const [theme, setTheme] = useState(darkTheme);
  const [siteTheme] = useState("stone");

  // ✅ تحميل الثيم المحفوظ
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    applyTheme(saved);
    document.documentElement.setAttribute("data-site-theme", "stone");
  }, []);

  // ✅ دالة لتطبيق الثيم
  const applyTheme = (mode) => {
    setThemeName(mode);
    setTheme(mode === "dark" ? darkTheme : lightTheme);

    // تحديث الـ attribute على <html>
    document.documentElement.setAttribute("data-theme", mode);

    // تحديث الـ class الخاصة بـ Tailwind (لو محتاج dark:)
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // تحديث بعض الـ CSS variables العامة
    document.documentElement.style.setProperty(
      "--color",
      mode === "dark" ? "#e0b873" : "#8f5d2e"
    );
    document.documentElement.style.setProperty(
      "--foreground",
      mode === "dark" ? "#f1eadc" : "#30271d"
    );
    document.documentElement.style.setProperty(
      "--background",
      mode === "dark" ? "#171615" : "#f4eee6"
    );
    document.documentElement.style.setProperty("--surface", mode === "dark" ? "#282522" : "#fffaf3");
    document.documentElement.style.setProperty("--surface-raised", mode === "dark" ? "#332d27" : "#ffffff");
    document.documentElement.style.setProperty("--muted", mode === "dark" ? "#b7a991" : "#6f5c49");
    document.documentElement.style.setProperty("--line", mode === "dark" ? "rgba(224,184,115,.22)" : "rgba(112,69,31,.2)");
  };

  // ✅ دالة لتبديل الثيم
  const toggleThemeFun = () => {
    const newTheme = themeName === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleThemeFun, siteTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
