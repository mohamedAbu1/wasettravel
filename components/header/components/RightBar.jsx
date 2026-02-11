"use client";
import { Avatar, Button, Typography, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { usePurchase } from "@/context/PurchaseContext";

export default function RightBar() {
  const { isLoggedIn, logout, user, handleOpen } = useAuth();
  const { themeName } = useTheme();
  const { t } = useTranslation("header");
  const { currency, setCurrency } = usePurchase();
  // ✅ حالة العملة

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <ThemeToggle />

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
      <Select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        size="small"
        IconComponent={() => null} // ✅ يخفي السهم تمامًا
        sx={{
          padding: "8px 16px",
          borderRadius: "12px",
          fontWeight: "600",
          background: "linear-gradient(to right, #ca8a04, #eab308)", // خلفية مخصصة
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          "& .MuiSelect-icon": {
            color: "#fff", // لون السهم
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // إزالة البوردر الافتراضي
          },
          "&:hover": {
            background: "linear-gradient(to right, #b45309, #d97706)",
          },
        }}
      >
        <MenuItem value="USD">USD $</MenuItem>
        <MenuItem value="EUR">EUR €</MenuItem>
      </Select>

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
              color: themeName === "dark" ? "#fff" : "#333",
            }}
          >
            {user.name}
          </Typography>
        </div>
      )}
    </div>
  );
}
