"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext"; // ✅ استخدام AuthContext
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";

export default function LoginModal() {
  const { loginOpen, handleLoginClose, handleSignUpOpen } = useData();
  const { themeName } = useTheme();
  const isDark = themeName === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation("home");

  // ✅ جلب الدوال من AuthContext
  const { login, loginWithGoogle, loading, handleClose } = useAuth();
  const { validateField } = useSecurity();

  // ✅ تسجيل الدخول بالبريد وكلمة المرور
  const handleSubmit = useCallback(async () => {
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    try {
      await login(email, password);
      toast.success("✅ Logged in successfully!");
      handleLoginClose();
      handleClose();
    } catch (err) {
      toast.error("❌ Error: The email or password is incorrect.");
    }
  }, [email, password, validateField, login, handleLoginClose, handleClose]);

  return (
    <Dialog open={loginOpen} onClose={handleLoginClose} fullWidth maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: isDark
            ? "rgba(20,20,20,0.55)"
            : "linear-gradient(135deg, #ffffff, #fdf6e3)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          border: "1px solid rgba(201,163,74,0.3)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", padding: "28px 0 16px" }}>
          <h2
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "40px",
              fontWeight: "700",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "linear-gradient(to right, #c9a34a, #b9972f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 12px rgba(201,163,74,0.25)",
            }}
          >
            {t("Login")}
          </h2>
        </div>

        {/* Content */}
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "32px",
          }}
        >
          <TextField
            label={t("Email")}
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdEmail color="#c9a34a" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label={t("Password")}
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock color="#c9a34a" />
                </InputAdornment>
              ),
            }}
          />

          <Divider style={{ margin: "16px 0", color: "#b9972f" }}>
            {t("orcontinuewith")}
          </Divider>

          {/* Social Buttons */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <IconButton
              onClick={loginWithGoogle} // ✅ استدعاء الدالة من AuthContext
              style={{
                width: "280px",
                height: "56px",
                borderRadius: "12px",
                background:
                  "linear-gradient(to right, #4285F4, #34A853, #FBBC05, #EA4335)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
            >
              <FcGoogle size={28} />
              <span style={{ color: "#fff" }}>Sign in with Google</span>
            </IconButton>
          </div>

          {/* Login Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              style={{
                marginTop: "12px",
                background: "linear-gradient(to right, #c9a34a, #eab308)",
                color: "#fff",
                fontWeight: "700",
                padding: "14px",
                borderRadius: "14px",
                boxShadow: "0 6px 24px rgba(201,163,74,0.4)",
              }}
            >
              {loading ? t("Loggingin") : t("Login")}
            </Button>
          </motion.div>

          {/* زر العودة إلى إنشاء حساب */}
          <Button
            variant="text"
            fullWidth
            onClick={() => {
              handleLoginClose();
              handleSignUpOpen();
            }}
            style={{
              marginTop: "8px",
              color: "#c9a34a",
              fontWeight: "600",
              textTransform: "none",
            }}
          >
            {t("Don’thaveanaccount?SignUp")}
          </Button>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
