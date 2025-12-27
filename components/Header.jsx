"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { themeName, toggleTheme, theme } = useTheme();

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? `${theme.background} ${theme.border} ${theme.shadow}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`text-3xl font-extrabold tracking-wide ${theme.title}`}
        >
          WasetTravel
        </Link>

        {/* Desktop Navigation */}
        <nav
          className={`hidden md:flex items-center gap-10 ${theme.subText} font-medium text-lg`}
        >
          <Link href="/" className="hover:text-[#d4af37] transition">
            Home
          </Link>
          <Link href="/trips" className="hover:text-[#d4af37] transition">
            Trips
          </Link>
          <Link href="/cities" className="hover:text-[#d4af37] transition">
            Cities
          </Link>
          <Link href="/contact" className="hover:text-[#d4af37] transition">
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme.buttonSecondary}`}
          >
            {themeName === "dark" ? <BsSun /> : <BsMoon />}
          </button>

          {/* CTA */}
          <Link
            href="/trips"
            className={`hidden md:block ${theme.buttonPrimary}`}
          >
            Book Now
          </Link>

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
            className={`w-64 ${theme.card} h-full p-6 border-l ${theme.border} shadow-xl`}
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
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#d4af37] transition"
              >
                Home
              </Link>
              <Link
                href="/trips"
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#d4af37] transition"
              >
                Trips
              </Link>
              <Link
                href="/cities"
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#d4af37] transition"
              >
                Cities
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#d4af37] transition"
              >
                Contact
              </Link>
            </nav>

            {/* CTA */}
            <Link
              href="/trips"
              onClick={() => setMenuOpen(false)}
              className={`mt-10 block text-center ${theme.buttonPrimary}`}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
