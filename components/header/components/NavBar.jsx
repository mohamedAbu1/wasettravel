"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

// دالة بسيطة لتحويل النص لـ Base64
const encodeQuery = (queryObj) => {
  const str = JSON.stringify(queryObj);
  return Buffer.from(str).toString("base64");
};

export default function NavBar({ scrolled }) {
  const { themeName } = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation("header");

  const navItems = ["home", "trips", "about", "contact","b2b"];

  const segments = pathname.split("/").filter(Boolean);
  const langPrefix = segments[0];
  const normalizedPath = "/" + segments.slice(1).join("/");

  return (
    <motion.nav
      initial={false}
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
      }}
      className="site-nav hidden lg:flex items-center gap-1 font-medium"
    >
      {navItems.map((item) => {
        let path;
        if (item === "home") {
          path = "/";
        } else if (item === "trips") {
          // ✅ القيم الافتراضية كل مرة
          const encoded = encodeQuery({
            city: "all",
            category: "all",
            price: "All",
            popular: false,
          });
          path = `/trips?data=${encoded}`;
        } else {
          path = `/${item}`;
        }

        const isActive =
          (item === "home" && normalizedPath === "/") ||
          (item !== "home" && normalizedPath.startsWith(`/${item}`));

        return (
          <motion.div
            key={item}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link
              href={`/${langPrefix}${path}`}
              className={`site-nav__link relative uppercase group px-4 py-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "site-nav__link--active font-bold"
                  : themeName === "dark"
                  ? "text-gray-200 hover:text-yellow-400"
                  : normalizedPath !== "/"
                  ? "text-gray-800 hover:text-yellow-600 font-semibold"
                  : scrolled
                  ? "text-gray-800 hover:text-yellow-600"
                  : "text-gray-200 hover:text-yellow-600"
              }`}
            >
              <span>{t(item)}</span>
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
