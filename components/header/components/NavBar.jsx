"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { themeName } = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation("header");

  const navItems = ["home", "trips", "about", "contact"];

  // 🟢 اطبع المسار الأصلي
  console.log("🔎 Raw pathname:", pathname);

  // ✅ تجاهل أول segment لو هو لغة (en, ar, fr...)
  const segments = pathname.split("/").filter(Boolean); // يقسم المسار
  const langPrefix = segments[0]; // أول جزء غالبًا لغة
  const normalizedPath = "/" + segments.slice(1).join("/"); // باقي المسار بدون اللغة

  console.log("👉 Lang prefix:", langPrefix);
  console.log("👉 Normalized path:", normalizedPath);

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
      className={`hidden lg:flex items-center gap-10 font-medium text-lg`}
    >
      {navItems.map((item) => {
        const path = item === "home" ? "/" : `/${item}`;
        const isActive =
          (item === "home" && normalizedPath === "/") ||
          (item !== "home" && normalizedPath.startsWith(`/${item}`));

        // 🟢 اطبع كل خطوة
        console.log("👉 Item:", item);
        console.log("👉 Path for item:", path);
        console.log("👉 Normalized Path:", normalizedPath);
        console.log("👉 isActive:", isActive);

        return (
          <motion.div
            key={item}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link
              href={`/${langPrefix}${path}`} // ✅ أضف اللغة للرابط
              className={`relative group px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-yellow-400 text-black font-bold shadow-md scale-105 border-b-4 border-yellow-500"
                  : themeName === "dark"
                  ? "text-amber-50 hover:text-yellow-400"
                  : "text-gray-600 hover:text-yellow-500"
              }`}
            >
              <span>{t(item)}</span>
              <span
                className={`absolute left-0 -bottom-1 h-[3px] bg-yellow-400 rounded-full transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
              {isActive && (
                <span className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-500 rounded-full shadow-md animate-pulse"></span>
              )}
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
