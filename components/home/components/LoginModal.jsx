"use client";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";

export default function LoginModal() {
  const { loginOpen, handleLoginClose, handleOpen } = useData();
  const { themeName } = useTheme();
  const isDark = themeName === "dark";

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
            Login
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
            label="Email"
            type="email"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdEmail color="#c9a34a" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock color="#c9a34a" />
                </InputAdornment>
              ),
            }}
          />

          <Divider style={{ margin: "16px 0", color: "#b9972f" }}>
            or continue with
          </Divider>

          {/* Social Buttons */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <IconButton>
              <FcGoogle size={26} />
            </IconButton>
            <IconButton style={{ color: "#1877f2" }}>
              <FaFacebook size={26} />
            </IconButton>
          </div>

          {/* Login Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              fullWidth
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
              Login
            </Button>
          </motion.div>

          {/* زر العودة إلى إنشاء حساب */}
          <Button
            variant="text"
            fullWidth
            onClick={() => {
              handleLoginClose();
              handleOpen(); // يفتح نافذة Sign Up
            }}
            style={{
              marginTop: "8px",
              color: "#c9a34a",
              fontWeight: "600",
              textTransform: "none",
            }}
          >
            Don’t have an account? Sign Up
          </Button>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
