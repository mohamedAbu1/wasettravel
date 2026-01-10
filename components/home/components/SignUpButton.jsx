"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // نستدعي الـ Context اللي فيه register
import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaFemale, FaMale } from "react-icons/fa";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";

export default function SignUpModal() {
  const { handleLoginOpen } = useData();
  const { themeName } = useTheme();
  const isDark = themeName === "dark";
  const { validateField } = useSecurity(); // دالة التحقق
  // state للحقول
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const { register, loading, error, open, handleClose } = useAuth(); // من الـ Context

  const handleSubmit = async () => {
    const nameError = validateField("Full Name", fullName);
    const emailError = validateField("Email", email);
    const passwordError = validateField("Password", password);
    if (nameError || emailError || passwordError || !gender) {
      toast.error(
        nameError || emailError || passwordError || "Gender is required"
      );
      return;
    }
    try {
      await register(email, password, fullName, gender);
      handleClose(); // إغلاق المودال بعد النجاح
    } catch (err) {
      toast.error("❌ Error: " + err.message);
    }
  };

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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            label="Password"
            type="password"
            variant="outlined"
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
          <FormLabel
            component="legend"
            style={{ color: "#c9a34a", fontWeight: "600" }}
          >
            Gender
          </FormLabel>
          <RadioGroup
            row
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ justifyContent: "center", gap: "20px" }}
          >
            <FormControlLabel
              value="male"
              control={<Radio />}
              label={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaMale color="#1e40af" /> Male
                </div>
              }
            />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaFemale color="#db2777" /> Female
                </div>
              }
            />
          </RadioGroup>
          <Divider style={{ margin: "16px 0", color: "#b9972f" }}>
            or sign up with
          </Divider>

          {/* Social Buttons */}
          <div
            style={{ display: "flex", gap: "16px", justifyContent: "center" }}
          >
            <IconButton>
              <FcGoogle size={26} />
            </IconButton>
            <IconButton style={{ color: "#1877f2" }}>
              <FaFacebook size={26} />
            </IconButton>
          </div>

          {/* Sign Up Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ marginTop: "16px" }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: "linear-gradient(to right, #c9a34a, #eab308)",
                color: "#fff",
                fontWeight: "700",
                padding: "14px",
                borderRadius: "14px",
              }}
            >
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </motion.div>

          {/* {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>} */}

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
