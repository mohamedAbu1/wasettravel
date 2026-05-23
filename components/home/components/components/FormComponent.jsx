"use client";
import React from "react";
import {
  TextField,
  InputAdornment,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { MdPerson, MdEmail, MdLock } from "react-icons/md";
import { FaMale, FaFemale } from "react-icons/fa";

export default function FormComponent({
  t,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  gender,
  setGender,
  isDark,
  borderColor,
  textFieldStyle,
}) {
  return (
    <>
      <TextField
        label={t("FullName")}
        fullWidth
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdPerson color={borderColor} />
            </InputAdornment>
          ),
        }}
        sx={textFieldStyle}
      />

      <TextField
        label={t("Email")}
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdEmail color={isDark ? "#FFD700" : "#c9a34a"} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: isDark ? "#FFD700" : "#c9a34a" },
            "&:hover fieldset": { borderColor: isDark ? "#FFD700" : "#c9a34a" },
            "&.Mui-focused fieldset": {
              borderColor: isDark ? "#FFD700" : "#c9a34a",
            },
            backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "#aaf",
          },
          "& .MuiInputLabel-root": {
            color: isDark ? "#FFD700" : "#3a2c0a",
            fontWeight: "bold",
          },
          "& .MuiInputBase-input": {
            color: isDark ? "#ffffff" : "#1a1a1a",
            fontWeight: "600",
          },
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
              <MdLock color={borderColor} />
            </InputAdornment>
          ),
        }}
        sx={textFieldStyle}
      />

      <FormLabel component="legend" style={{ color: "#c9a34a", fontWeight: "600" }}>
        {t("Gender")}
      </FormLabel>
      <RadioGroup
        row
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        style={{ justifyContent: "center", gap: "20px" }}
      >
        {/* القيمة الداخلية ثابتة بالإنجليزية */}
        <FormControlLabel
          value="male"
          control={<Radio />}
          label={<><FaMale color="#1e40af" /> {t("male")}</>}
        />
        <FormControlLabel
          value="female"
          control={<Radio />}
          label={<><FaFemale color="#db2777" /> {t("female")}</>}
        />
      </RadioGroup>

      <Divider style={{ margin: "16px 0", color: "#b9972f" }}>
        {t("orsignupwith")}
      </Divider>
    </>
  );
}
