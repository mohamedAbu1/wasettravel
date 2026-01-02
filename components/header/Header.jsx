"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { themeName, toggleTheme, theme } = useTheme();
  const pathname = usePathname();
  const navItems = ["Home", "Trips", "Cities", "Contact", "Admin"];
  const { handleOpen } = useData();
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? `${theme.background} ${theme.border} ${theme.shadow}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop Navigation */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className={`hidden md:flex items-center gap-10 ${theme.subText} font-medium text-lg`}
        >
          {navItems.map((item) => {
            const path =
              item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = pathname === path;
            return (
              <motion.div
                key={item}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  href={path}
                  className={`relative group ${
                    isActive ? "text-[#d4af37] font-semibold" : ""
                  }`}
                >
                  <span
                    className={`transition ${
                      isActive
                        ? "text-[#d4af37]"
                        : themeName === "dark"
                        ? "text-amber-50 hover:text-[#d4af37]"
                        : "text-[#999] hover:text-[#d4af37]"
                    }`}
                  >
                    {item}
                  </span>
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-[#d4af37] transition-all ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.div whileHover={{ rotate: 20, scale: 1.1 }}>
            <Button
              onClick={toggleTheme}
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

          {/* CTA */}
          <motion.div whileHover={{ scale: 1.1 }} className=" hidden md:flex">
            <Button
              onClick={handleOpen}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(to right, #ca8a04, #eab308)",
                color: "#fff",
                fontWeight: "600",
                letterSpacing: "0.05em",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Sign Up
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          {/* <button
            className={`md:hidden ${theme.icon} text-3xl`}
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu />
          </button> */}
        </div>
      </div>

      {/* Mobile Menu */}
     
    </motion.header>
  );
}
