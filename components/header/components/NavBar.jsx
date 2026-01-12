"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { themeName, theme } = useTheme();
  const pathname = usePathname(); // ✅ هنا تستدعي المسار الحالي
  const { user } = useAuth();
  const { t } = useTranslation("header");

  // ✅ هنا تحط الكود بتاعك
  const currentPath = pathname.split("/").slice(1).join("/") || "";
  // لو الرابط هو "/" نخليه يساوي "home"
  const normalizePath = currentPath === "" ? "home" : currentPath;

  let navItems = ["home", "trips", "about", "contact"];
  if (user?.role?.toUpperCase() === "ADMIN") {
    navItems.push("admin");
  }
  console.log(normalizePath);
  return (
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
      className={`hidden lg:flex items-center gap-10 ${theme.subText} font-medium text-lg`}
    >
      {navItems.map((item) => {
        const path = item === "home" ? "/" : `/${item}`;
        const firstSegment = pathname.split("/")[1] || "home";
        const isActive = firstSegment === item;

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
                {t(item)}
              </span>
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-[#d4af37] transition-all ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
