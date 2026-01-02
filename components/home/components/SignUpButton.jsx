"use client";
import { motion } from "framer-motion";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { MdPerson, MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function SignUpModal() {
  const { handleClose, open, handleLoginOpen } = useData();
  const { themeName } = useTheme();
  const isDark = themeName === "dark";

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: isDark
            ? "rgba(20,20,20,0.55)"
            : "linear-gradient(135deg, #ffffff, #fdf6e3)",
          backdropFilter: "blur(18px)",
          borderRadius: "24px",
          border: "1px solid rgba(201,163,74,0.3)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", padding: "32px 0 20px" }}>
          <h1
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "46px",
              fontWeight: "700",
              letterSpacing: "4px",
              textTransform: "uppercase",
              background: "linear-gradient(to right, #c9a34a, #b9972f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            WasetTravel
          </h1>
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
            label="Full Name"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdPerson color="#c9a34a" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email"
            type="email"
            variant="outlined"
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
            variant="outlined"
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
            or sign up with
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

          {/* Sign Up Button */}
          <motion.div whileHover={{ scale: 1.05 }} style={{ marginTop: "16px" }}>
            <Button
              variant="contained"
              fullWidth
              style={{
                background: "linear-gradient(to right, #c9a34a, #eab308)",
                color: "#fff",
                fontWeight: "700",
                padding: "14px",
                borderRadius: "14px",
              }}
            >
              Sign Up
            </Button>
          </motion.div>

          {/* زر فتح نافذة تسجيل الدخول */}
          <Button
            variant="text"
            fullWidth
            onClick={handleLoginOpen}
            style={{
              marginTop: "8px",
              color: "#c9a34a",
              fontWeight: "600",
              textTransform: "none",
            }}
          >
            Already have an account? Login
          </Button>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
