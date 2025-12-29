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
  const { handleClose, open } = useData();
  const { themeName } = useTheme();
  const isDark = themeName === "dark";

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: isDark
            ? "rgba(0,0,0,0.1)"
            : "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          border: "1px solid rgba(201,163,74,0.4)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            padding: "28px 0 16px",
            background: "transparent",
          }}
        >
          <h1
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "42px",
              fontWeight: "700",
              letterSpacing: "3px",
              textTransform: "uppercase",
              background: "linear-gradient(to right, #c9a34a, #b9972f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: isDark
                ? "1px 1px 2px rgba(255,255,255,0.2)"
                : "1px 1px 2px rgba(0,0,0,0.4)",
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
            gap: "18px",
            padding: "28px",
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

          <Divider style={{ margin: "12px 0", color: isDark ? "#aaa" : "#555" }}>
            or sign up with
          </Divider>

          {/* Social Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <IconButton
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                padding: "10px 20px",
                backdropFilter: "blur(6px)",
              }}
            >
              <FcGoogle size={24} />
            </IconButton>
            <IconButton
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                padding: "10px 20px",
                color: "#1877f2",
                backdropFilter: "blur(6px)",
              }}
            >
              <FaFacebook size={24} />
            </IconButton>
          </div>

          {/* Sign Up Button */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="contained"
              fullWidth
              style={{
                marginTop: "12px",
                background: "linear-gradient(to right, #ca8a04, #eab308)",
                color: "#fff",
                fontWeight: "600",
                padding: "12px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
            >
              Sign Up
            </Button>
          </motion.div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
