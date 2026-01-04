"use client";
import React from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { themeName, toggleThemeFun } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.1 }}>
      <Button
        sx={{ zIndex: 9999 }}
        onClick={toggleThemeFun}
        className={`
                p-2 rounded-full border transition-all duration-300
                ${
                  themeName === "dark"
                    ? "bg-yellow-500 text-black border-yellow-600 hover:bg-yellow-600 hover:text-white"
                    : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 hover:text-black"
                }
              `}
      >
        {themeName === "dark" ? (
          <BsSun size={20} color="#fff" />
        ) : (
          <BsMoon size={20} color="#999" />
        )}
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
