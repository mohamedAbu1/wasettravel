"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import MobileNav from "./components/MobileNav";
import ThemeToggle from "../ThemeToggle";
import dynamic from "next/dynamic";

const RightBar = dynamic(() => import("./components/RightBar"), { ssr: false });
const MobileHeaderAuth = dynamic(() => import("./components/MobileHeaderAuth"), { ssr: false });

// ✅ Lazy load للأيقونات
const FaSignOutAlt = dynamic(() => import("react-icons/fa").then(mod => mod.FaSignOutAlt), { ssr: false });
const FaUserPlus = dynamic(() => import("react-icons/fa").then(mod => mod.FaUserPlus), { ssr: false });

export default function Header({ overlay = true }) {
  const [scrolled, setScrolled] = useState(false);
  const { userData } = useAuth();
  const { handleLoginOpen } = useData();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true }); // ✅ تحسين الأداء
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      role="banner" // ✅ تحسين الـ accessibility
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`site-header ${overlay ? "fixed" : "relative"} top-0 left-0 z-45 w-full ${scrolled ? "site-header--scrolled" : "site-header--top"}`}
    >
      <div className="site-header__inner mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Logo scrolled={scrolled} />
        <NavBar scrolled={scrolled} />
        <RightBar scrolled={scrolled} />

        {/* ✅ زر تسجيل الدخول/الخروج */}
        <motion.div whileHover={{ scale: 1.03 }} className="header-auth-wrap hidden lg:flex">
          <button
            type="button"
            aria-label={userData ? "Sign out" : "Sign in"} // ✅ تحسين الـ accessibility
            onClick={userData ? logout : handleLoginOpen}
            className="header-auth-btn"
            >
            {userData ? <FaSignOutAlt size={20} /> : <FaUserPlus size={20} />}
            <span>{userData ? "Sign out" : "Sign in"}</span>
          </button>
        </motion.div>

        <ThemeToggle scrolled={scrolled} />
        <MobileHeaderAuth />
        <MobileNav />
      </div>
    </motion.header>
  );
}
