"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import RightBar from "./components/RightBar";
import Button from "@mui/material/Button";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { signOut } from "next-auth/react"; 
import MobileHeaderAuth from "./components/MobileHeaderAuth";
import ThemeToggle from "../ThemeToggle";
import dynamic from "next/dynamic";

// ✅ Lazy load للأيقونات
const FaSignOutAlt = dynamic(() => import("react-icons/fa").then(mod => mod.FaSignOutAlt), { ssr: false });
const FaUserPlus = dynamic(() => import("react-icons/fa").then(mod => mod.FaUserPlus), { ssr: false });

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const { userData } = useAuth();
  const { handleLoginOpen } = useData();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true }); // ✅ تحسين الأداء
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      role="banner" // ✅ تحسين الـ accessibility
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-45 transition-all duration-500 ${
        scrolled
          ? `${theme.background} ${theme.border} ${theme.shadow}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-8xl container mx-auto px-6 py-4 flex items-center justify-between">
        <Logo scrolled={scrolled} />
        <NavBar scrolled={scrolled} />
        <RightBar scrolled={scrolled} />

        {/* ✅ زر تسجيل الدخول/الخروج */}
        <motion.div whileHover={{ scale: 1.1 }} className="hidden lg:flex">
          <Button
            aria-label={userData ? "Sign out" : "Sign in"} // ✅ تحسين الـ accessibility
            onClick={userData ? () => signOut() : () => handleLoginOpen()}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(to right, #c9a34a, #eab308)",
              color: "#fff",
              fontWeight: "600",
              letterSpacing: "0.05em",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {userData ? <FaSignOutAlt size={20} /> : <FaUserPlus size={20} />}
          </Button>
        </motion.div>

        <ThemeToggle scrolled={scrolled} />
        <MobileHeaderAuth />
      </div>
    </motion.header>
  );
}
