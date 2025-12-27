/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import lightTheme from "@/constants/theme/lightTheme";
import darkTheme from "@/constants/theme/darkTheme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");
  const [theme, setTheme] = useState(lightTheme);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setThemeName(saved);
    setTheme(saved === "dark" ? darkTheme : lightTheme);

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = themeName === "dark" ? "light" : "dark";
    setThemeName(newTheme);
    localStorage.setItem("theme", newTheme);

    const selectedTheme = newTheme === "dark" ? darkTheme : lightTheme;
    setTheme(selectedTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
