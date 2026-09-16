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
import { MdClose, MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaFemale, FaMale } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";

export default function SignUpModal() {
  const { handleLoginOpen, signUpOpen, handleSignUpClose } = useData();
  const { t } = useTranslation("home");
  const { validateField } = useSecurity();
  const { register, loading, loginWithGoogle, error } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {
      fullName: validateField("Full Name", fullName),
      email: validateField("Email", email),
      password: validateField("Password", password),
      gender: gender ? "" : t("GenderRequired", { defaultValue: "Choose an option" }),
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const result = await register(email.trim(), password, fullName.trim(), gender);
    if (result) handleSignUpClose();
  };

  const switchToLogin = () => {
    handleSignUpClose();
    handleLoginOpen();
  };

  return (
    <Dialog
      open={signUpOpen}
      onClose={handleSignUpClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="signup-dialog-title"
      PaperProps={{ className: "auth-dialog-paper auth-dialog-paper--signup" }}
    >
      <motion.div
        className="auth-modal-shell"
        initial={{ opacity: 0, y: 18, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .28, ease: "easeOut" }}
      >
        <aside className="auth-modal-aside auth-modal-aside--signup">
          <div className="auth-modal-mark" aria-hidden="true">𓂀</div>
          <p className="auth-modal-kicker">WasetTravel · Your Egypt story</p>
          <h2>{t("CreateYourAccount", { defaultValue: "Create your account" })}</h2>
          <p>{t("SignupIntro", { defaultValue: "Save your favorite journeys and plan every detail with confidence." })}</p>
          <ul className="auth-benefits">
            <li><span aria-hidden="true">✓</span>{t("SaveTrips", { defaultValue: "Save trips for later" })}</li>
            <li><span aria-hidden="true">✓</span>{t("PersonalizedPlanning", { defaultValue: "Personalized travel planning" })}</li>
            <li><span aria-hidden="true">✓</span>{t("LocalSupport", { defaultValue: "Support from local experts" })}</li>
          </ul>
        </aside>

        <DialogContent className="auth-modal-content">
          <IconButton className="auth-modal-close" onClick={handleSignUpClose} aria-label="Close sign up dialog"><MdClose /></IconButton>
          <div className="auth-modal-heading">
            <p className="auth-modal-eyebrow">{t("SignUp", { defaultValue: "Sign up" })}</p>
            <h1 id="signup-dialog-title">{t("StartYourJourney", { defaultValue: "Start your journey" })}</h1>
            <p>{t("SignupDescription", { defaultValue: "A few details are all we need to get you started." })}</p>
          </div>
          {error ? <div className="auth-form-error" role="alert" aria-live="polite">{error}</div> : null}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <TextField
              className="auth-field"
              label={t("FullName", { defaultValue: "Full name" })}
              value={fullName}
              onChange={(event) => { setFullName(event.target.value); setErrors((current) => ({ ...current, fullName: "" })); }}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName || " "}
              autoComplete="name"
              required
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><MdPerson /></InputAdornment> }}
            />
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
              autoComplete="new-password"
              required
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><MdLock /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword((current) => !current)} edge="end" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <MdVisibilityOff /> : <MdVisibility />}</IconButton></InputAdornment>,
              }}
            />

            <fieldset className={`auth-gender ${errors.gender ? "auth-gender--error" : ""}`}>
              <legend>{t("Gender", { defaultValue: "Gender" })}</legend>
              <div className="auth-gender-options">
                <label className={`auth-choice ${gender === "male" ? "auth-choice--selected" : ""}`}>
                  <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={(event) => { setGender(event.target.value); setErrors((current) => ({ ...current, gender: "" })); }} />
                  <FaMale aria-hidden="true" /><span>{t("male", { defaultValue: "Male" })}</span>
                </label>
                <label className={`auth-choice ${gender === "female" ? "auth-choice--selected" : ""}`}>
                  <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={(event) => { setGender(event.target.value); setErrors((current) => ({ ...current, gender: "" })); }} />
                  <FaFemale aria-hidden="true" /><span>{t("female", { defaultValue: "Female" })}</span>
                </label>
              </div>
              {errors.gender ? <p className="auth-inline-error">{errors.gender}</p> : null}
            </fieldset>

            <Button className="auth-primary-button" type="submit" fullWidth disabled={loading}>
              {loading ? t("Creating", { defaultValue: "Creating..." }) : t("SignUp", { defaultValue: "Create account" })}
            </Button>
          </form>

          <div className="auth-divider"><Divider><span>{t("orsignupwith", { defaultValue: "or continue with" })}</span></Divider></div>
          <Button className="auth-google-button" type="button" fullWidth onClick={loginWithGoogle} disabled={loading} startIcon={<FcGoogle />}>
            {t("ContinueWithGoogle", { defaultValue: "Continue with Google" })}
          </Button>

          <p className="auth-switch-copy">
            {t("Alreadyhaveanaccount?Login", { defaultValue: "Already have an account?" })}
            <button type="button" onClick={switchToLogin}>{t("Login", { defaultValue: "Log in" })}</button>
          </p>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
