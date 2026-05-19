"use client";
import { Typography } from "@mui/material";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

export default function RightBar({ scrolled }) {
  const { isLoggedIn, user } = useAuth();
  const { themeName } = useTheme();
  const { t } = useTranslation("header");

  const pathname = usePathname();
  // ✅ حالة العملة
  const segments = pathname.split("/").filter(Boolean);
  console.log(user);
  const isHome =
    segments.length === 0 ||
    (segments.length === 1 &&
      ["en", "fr", "de", "it", "es", "pt"].includes(segments[0]));

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <ThemeToggle scrolled={scrolled} />

      {/* عرض المستخدم */}
      {isLoggedIn && user && (
        <div className="hidden lg:flex items-center gap-2">
          {" "}
          <img
            alt={user?.user_metadata?.name || "User Avatar"}
            src={
              user?.user_metadata?.picture || // صورة جوجل
              user?.user_metadata?.avatar_url || // صورة من Supabase
              user?.user_metadata?.avatar || // صورة من التسجيل العادي
              "/default-avatar.png" // صورة افتراضية
            }
            width={40}
            height={40}
            style={{ border: "2px solid #d4af37", borderRadius: "50%" }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              textTransform: "capitalize",
              fontWeight: "600",
              color:
                themeName === "dark"
                  ? "#fff"
                  : !isHome
                    ? "#333"
                    : scrolled
                      ? "#333"
                      : "#fff",
            }}
          >
            {" "}
            {user?.user_metadata?.name}{" "}
          </Typography>{" "}
        </div>
      )}
    </div>
  );
}
