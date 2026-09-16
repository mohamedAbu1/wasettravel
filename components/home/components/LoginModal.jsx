"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { MdClose, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";

export default function LoginModal() {
  const { loginOpen, handleLoginClose, handleSignUpOpen } = useData();
  const { t } = useTranslation("home");
  const { login, loginWithGoogle, loading } = useAuth();
  const { validateField } = useSecurity();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {
      email: validateField("Email", email),
      password: validateField("Password", password),
    };
    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const user = await login(email.trim(), password);
    if (user) handleLoginClose();
  };

  const switchToSignUp = () => {
    handleLoginClose();
    handleSignUpOpen();
  };

  return (
    <Dialog
      open={loginOpen}
      onClose={handleLoginClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="login-dialog-title"
      PaperProps={{ className: "auth-dialog-paper auth-dialog-paper--login" }}
    >
      <motion.div
        className="auth-modal-shell"
        initial={{ opacity: 0, y: 18, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .28, ease: "easeOut" }}
      >
        <aside className="auth-modal-aside">
          <div className="auth-modal-mark" aria-hidden="true">𓂀</div>
          <p className="auth-modal-kicker">WasetTravel · Upper Egypt</p>
          <h2>{t("WelcomeBack", { defaultValue: "Welcome back" })}</h2>
          <p>{t("LoginIntro", { defaultValue: "Continue planning memorable journeys through Egypt." })}</p>
          <div className="auth-modal-aside-note">
            <span aria-hidden="true">✦</span>
            <span>{t("LocalExperts", { defaultValue: "Local experts. Thoughtful journeys." })}</span>
          </div>
        </aside>

        <DialogContent className="auth-modal-content">
          <IconButton className="auth-modal-close" onClick={handleLoginClose} aria-label="Close login dialog">
            <MdClose />
          </IconButton>
          <div className="auth-modal-heading">
            <p className="auth-modal-eyebrow">{t("Login", { defaultValue: "Login" })}</p>
            <h1 id="login-dialog-title">{t("SignInToContinue", { defaultValue: "Sign in to continue" })}</h1>
            <p>{t("LoginDescription", { defaultValue: "Access your saved trips and travel plans." })}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <TextField
              className="auth-field"
              label={t("Email", { defaultValue: "Email" })}
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: "" })); }}
              error={Boolean(errors.email)}
              helperText={errors.email || " "}
              autoComplete="email"
              required
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><MdEmail /></InputAdornment> }}
            />
            <TextField
              className="auth-field"
              label={t("Password", { defaultValue: "Password" })}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: "" })); }}
              error={Boolean(errors.password)}
              helperText={errors.password || " "}
              autoComplete="current-password"
              required
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><MdLock /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword((current) => !current)} edge="end" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <MdVisibilityOff /> : <MdVisibility />}</IconButton></InputAdornment>,
              }}
            />

            <Button className="auth-primary-button" type="submit" fullWidth disabled={loading}>
              {loading ? t("Loggingin", { defaultValue: "Logging in..." }) : t("Login", { defaultValue: "Login" })}
            </Button>
          </form>

          <div className="auth-divider"><Divider><span>{t("orcontinuewith", { defaultValue: "or continue with" })}</span></Divider></div>
          <Button className="auth-google-button" type="button" fullWidth onClick={loginWithGoogle} disabled={loading} startIcon={<FcGoogle />}>
            {t("ContinueWithGoogle", { defaultValue: "Continue with Google" })}
          </Button>

          <p className="auth-switch-copy">
            {t("Don’thaveanaccount?SignUp", { defaultValue: "Don’t have an account?" })}
            <button type="button" onClick={switchToSignUp}>{t("SignUp", { defaultValue: "Sign up" })}</button>
          </p>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
