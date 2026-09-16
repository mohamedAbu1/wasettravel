"use client";
import React from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { themeName, toggleThemeFun } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.1 }}>
      <button
        type="button"
        onClick={toggleThemeFun}
        aria-label={themeName === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={themeName === "light"}
        title={themeName === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className={`theme-toggle ${themeName === "dark" ? "theme-toggle--dark" : "theme-toggle--light"}`}
      >
        {themeName === "dark" ? (
          <BsSun size={20} aria-label="dark mode" />
        ) : (
          <BsMoon size={20} aria-label="light mode" />
        )}
      </button>
    </motion.div>
  );
};

export default ThemeToggle;
