"use client";
import { Avatar, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function RightBar() {
  const { isLoggedIn, logout, user, handleOpen } = useAuth();
  const { themeName } = useTheme();
  const { t } = useTranslation("header");

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <ThemeToggle />
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
