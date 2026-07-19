"use client";
import React from "react";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { FaDollarSign, FaEuroSign } from "react-icons/fa";
import { usePurchase } from "@/context/PurchaseContext";

export default function PriceSelect({ price, setPrice, t, theme }) {
  const { currency } = usePurchase();

  // ✅ أسعار بالدولار كـ base
  const rangesUSD = [
    { label: "0 - 199", value: "Economy", min: 0, max: 199 },
    { label: "200 - 599", value: "Standard", min: 200, max: 599 },
    { label: "600+", value: "Luxury", min: 600, max: Infinity },
  ];

  // ✅ معدل التحويل (مثال: 1 USD = 0.85 EUR)
  const conversionRate = 0.85;

  // ✅ تحويل الأسعار حسب العملة
  const priceRanges =
    currency === "EUR"
      ? rangesUSD.map((r) => ({
          ...r,
          label:
            r.max === Infinity
              ? `${(r.min * conversionRate).toFixed(0)}+ €`
              : `${(r.min * conversionRate).toFixed(0)} - ${(r.max * conversionRate).toFixed(0)} €`,
        }))
      : rangesUSD.map((r) => ({
          ...r,
          label:
            r.max === Infinity
              ? `${r.min}+ $`
              : `${r.min} - ${r.max} $`,
        }));

  return (
    <TextField
      select
      label={currency === "USD" ? t("MaxPrice") : t("MaxPrice2")}
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {currency === "USD" ? (
              <FaDollarSign
                className={theme.icon}
                style={{ color: "#C9A34A", fontSize: "30px" }}
              />
            ) : (
              <FaEuroSign
                className={theme.icon}
                style={{ color: "#C9A34A", fontSize: "30px" }}
              />
            )}
          </InputAdornment>
        ),
      }}
      sx={{
        borderRadius: 3,
        "& .MuiOutlinedInput-root": {
          padding: "5px",
          color: "#2C2C2C",
          fontWeight: "800",
          letterSpacing: "0.5px",
          transition: "all 0.3s ease",
          "& fieldset": {
            borderColor: "#C9A34A",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          },
          "&:hover fieldset": {
            borderColor: "#B9972F",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#B9972F",
            boxShadow: "0 0 0 2px rgba(201,163,74,0.25)",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#C9A34A",
          fontWeight: "600",
          letterSpacing: "0.4px",
        },
        "& .MuiInputBase-input": {
          color: "#C9A34A",
          padding: "12px 14px",
        },
        "& .MuiMenuItem-root": {
          fontWeight: "500",
          color: "#2C2C2C",
          borderRadius: "8px",
          margin: "4px 8px",
          padding: "10px 14px",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(to right, #FFF3E0, #FFE0B2)",
            color: "#B9972F",
            transform: "scale(1.02)",
          },
          "&.Mui-selected": {
            background: "linear-gradient(to right, #C9A34A, #B9972F)",
            color: "#fff",
            fontWeight: "600",
          },
          "&.Mui-selected:hover": {
            background: "linear-gradient(to right, #B9972F, #A67C00)",
          },
        },
      }}
    >
      {priceRanges.map((range) => (
        <MenuItem key={range.value} value={range.value}>
          {range.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
