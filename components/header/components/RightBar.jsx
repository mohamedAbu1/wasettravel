"use client";
import React, { forwardRef } from "react";
import { Avatar, Button, Typography, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { usePurchase } from "@/context/PurchaseContext";
import { usePathname } from "next/navigation";

// ✅ تغليف Select بـ forwardRef لتوافق React 19
const CustomSelect = forwardRef((props, ref) => (
  <Select {...props} ref={ref} />
));

export default function RightBar({ scrolled }) {
  const { isLoggedIn, logout, user, handleOpen } = useAuth();
  const { themeName } = useTheme();
  const { t } = useTranslation("header");
  const { currency, setCurrency } = usePurchase();
  const pathname = usePathname();

  // ✅ تحديد إذا كنت في الهوم
  const segments = pathname.split("/").filter(Boolean);
  const isHome =
    segments.length === 0 ||
    (segments.length === 1 &&
      ["en", "fr", "de", "it", "es", "pt"].includes(segments[0]));

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <ThemeToggle scrolled={scrolled} />

      {/* زر تسجيل الدخول/الخروج */}
      <motion.div whileHover={{ scale: 1.1 }} className="hidden md:flex">
        <Button
          onClick={isLoggedIn ? logout : handleOpen}
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
          {isLoggedIn ? t("Logout") : t("SignUp")}
        </Button>
      </motion.div>

      {/* ✅ اختيار العملة */}
      <CustomSelect
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        size="small"
        IconComponent={() => null} // ✅ يخفي السهم
        sx={{
          padding: "8px 16px",
          borderRadius: "12px",
          fontWeight: "600",
          background:
            themeName === "dark"
              ? "linear-gradient(to right, #1f2937, #111827)"
              : "linear-gradient(to right, #ca8a04, #eab308)",
          color: themeName === "dark" ? "#f9fafb" : "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          "& .MuiSelect-icon": {
            color: "#f9fafb",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover": {
            background:
              themeName === "dark"
                ? "linear-gradient(to right, #374151, #1f2937)"
                : "linear-gradient(to right, #b45309, #d97706)",
          },
        }}
      >
        <MenuItem value="USD">USD $</MenuItem>
        <MenuItem value="EUR">EUR €</MenuItem>
      </CustomSelect>

      {/* عرض المستخدم */}
      {isLoggedIn && user && (
        <div className="flex items-center gap-2">
          <Avatar
            alt={user.name}
            src={user.avatar_url}
            sx={{ width: 40, height: 40, border: "2px solid #d4af37" }}
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
            {user.name}
          </Typography>
        </div>
      )}
    </div>
  );
}
