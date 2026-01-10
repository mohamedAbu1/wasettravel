"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function Logo() {
  const { themeName } = useTheme();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span
          className={
            themeName === "dark"
              ? `text-4xl font-bold tracking-wide text-white`
              : `text-4xl font-bold tracking-wide text-[#d4af37]`
          }
        >
          WasetTravel
        </span>
      </Link>
    </motion.div>
  );
}
