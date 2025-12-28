"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { themeName, toggleTheme, theme } = useTheme();
  const pathname = usePathname(); // بدل useRouter
  console.log(pathname)
  const navItems = ["Home", "Trips", "Cities", "Contact", "Admin"];
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeName === "dark");
  }, [themeName]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? `${theme.background} ${theme.border} ${theme.shadow}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* <Image
            src="/logo/wasettravel-logo.png" // ضع صورة اللوجو داخل public/logo
            alt="WasetTravel Logo"
            width={40}
            height={40}
            className="object-contain"
          /> */}
          <span className={themeName === "dark" ? `text-4xl font-bold tracking-wide text-white`: `text-4xl font-bold tracking-wide text-[#d4af37]`}>
            WasetTravel
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className={`hidden md:flex items-center gap-10 ${theme.subText} font-medium text-lg`}
        >
          {" "}
          {navItems.map((item) => {
            const path =
              item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = pathname === path;
            return (
              <Link
                key={item}
                href={path}
                className={`relative group ${
                  isActive ? "text-[#d4af37] font-semibold" : ""
                }`}
              >
                {" "}
                <span
                  className={`transition ${
                    isActive ? "text-[#d4af37]" : themeName === "dark" ? "text-amber-50 hover:text-[#d4af37]" :"text-[#999] hover:text-[#d4af37]" 
                  }`}
                >
                  {" "}
                  {item}{" "}
                </span>{" "}
                {/* underline effect */}{" "}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#d4af37] transition-all ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>{" "}
              </Link>
            );
          })}{" "}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
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
              <BsSun size={20} color={ themeName === "dark" ? "#fff":"#000"} />
            ) : (
              <BsMoon size={20}color={ themeName === "dark" ? "#fff":"#999"}  />
            )}
          </Button>

          {/* CTA */}
          <Button
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px 24px", // px-6 py-3
              background: "linear-gradient(to right, #ca8a04, #eab308)", // من الأصفر الغامق للأفتح
              color: "#fff",
              fontWeight: "600",
              letterSpacing: "0.05em",
              borderRadius: "0.5rem", // rounded-lg
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)", // shadow-lg
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={
              (e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(to right, #a16207, #ca8a04)") // hover effect
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(to right, #ca8a04, #eab308)")
            }
          >
            Book Now
          </Button>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${theme.icon} text-3xl`}
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
          <div
            className={`w-64 ${theme.card} h-full p-6 border-l ${
              theme.border
            } shadow-xl transform transition-transform duration-300 ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Close Button */}
            <button
              className={`${theme.icon} text-3xl mb-8`}
              onClick={() => setMenuOpen(false)}
            >
              <FiX />
            </button>

            {/* Menu Items */}
            <nav
              className={`flex flex-col gap-6 ${theme.subText} text-lg font-medium`}
            >
              {["Home", "Trips", "Cities", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${
                    item.toLowerCase() === "home" ? "" : item.toLowerCase()
                  }`}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[#d4af37] transition"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <Button
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: "2.5rem", // mt-10
                display: "block",
                textAlign: "center",
                padding: "12px 24px", // px-6 py-3
                background: "linear-gradient(to right, #ca8a04, #eab308)", // من الأصفر الغامق للأفتح
                color: "#fff",
                fontWeight: "600",
                letterSpacing: "0.05em",
                borderRadius: "0.5rem", // rounded-lg
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)", // shadow-lg
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={
                (e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(to right, #a16207, #ca8a04)") // hover effect
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(to right, #ca8a04, #eab308)")
              }
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
