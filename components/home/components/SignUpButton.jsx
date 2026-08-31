"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import HeaderComponent from "./components/HeaderComponent";
import FormComponent from "./components/FormComponent";
import ActionsComponent from "./components/ActionsComponent";

export default function SignUpModal() {
  const { handleLoginOpen, signUpOpen, handleSignUpClose } = useData();
  const { themeName } = useTheme();
  const isDark = themeName === "dark";
  const { validateField } = useSecurity();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const { t } = useTranslation("home");

  const { register, loading, loginWithGoogle, handleClose } = useAuth();

  // 🎨 ألوان واضحة للكتابة حسب الثيم
  const mainTextColor = isDark ? "#ffffff" : "#1a1a1a";
  const placeholderColor = isDark ? "#FFD700" : "#3a2c0a";
  const labelColor = isDark ? "#FFD700" : "#3a2c0a";
  const borderColor = isDark ? "#FFD700" : "#c9a34a";

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: borderColor },
      "&:hover fieldset": { borderColor: borderColor },
      "&.Mui-focused fieldset": { borderColor: borderColor },
      backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "#fff",
    },
    "& .MuiInputLabel-root": {
      color: labelColor,
      fontWeight: "600",
      fontSize: "0.95rem",
      letterSpacing: "0.5px",
    },
    "& .MuiInputBase-input": {
      color: mainTextColor,
      fontWeight: "600",
      fontSize: "1rem",
      letterSpacing: "0.3px",
    },
    "& .MuiInputBase-input::placeholder": {
      color: placeholderColor,
      opacity: 0.8,
      fontStyle: "italic",
    },
  };

  const handleSubmit = async () => {
    const nameError = validateField("Full Name", fullName);
    const emailError = validateField("Email", email);
    const passwordError = validateField("Password", password);
    if (nameError || emailError || passwordError || !gender) {
      toast.error(
        nameError || emailError || passwordError || "Gender is required",
      );
      return;
    }
    try {
      await register(email, password, fullName, gender);
      toast.success("✅ A confirmation message has been sent to your account.");
      handleClose();
    } catch (err) {
      toast.error("❌ Error: " + err.message);
    }
  };

  return (
    <Dialog 
      open={signUpOpen} 
      onClose={handleSignUpClose} 
      fullWidth 
      maxWidth="sm"
      aria-labelledby="signup-dialog-title" // ✅ وصف النافذة
    >
      <motion.div>
        <HeaderComponent isDark={isDark} />
        <DialogContent
          id="signup-dialog-content"
          aria-label="Sign up form" // ✅ وصف المحتوى
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "32px",
          }}
        >
          <FormComponent
            t={t}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            gender={gender}
            setGender={setGender}
            isDark={isDark}
            borderColor={borderColor}
            textFieldStyle={textFieldStyle}
          />
          <ActionsComponent
            t={t}
            loginWithGoogle={loginWithGoogle}
            handleSubmit={handleSubmit}
            loading={loading}
            handleLoginOpen={handleLoginOpen}
          />
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
