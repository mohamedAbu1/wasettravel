"use client";

import React, { useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FaCoins } from "react-icons/fa";
import { usePurchase } from "@/context/PurchaseContext";
import { useTheme } from "@/context/ThemeContext";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const currencyOptions = [
  { value: "USD", label: "USD", symbol: "$" },
  { value: "EUR", label: "EUR", symbol: "€" },
  { value: "EGP", label: "EGP", symbol: "£" },
];

export default function CurrencySelector() {
  const { currency, setCurrency } = usePurchase();
  const { themeName } = useTheme();
  const { country } = useApp();
  const { t } = useTranslation("ui");

  useEffect(() => {
    if (!country || localStorage.getItem("currency-manual") === "true") return;
    const euCountries = ["Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Austria", "Portugal", "Greece", "Finland", "Ireland", "Luxembourg", "Slovakia", "Slovenia", "Estonia", "Latvia", "Lithuania", "Cyprus", "Malta"];
    setCurrency(country === "Egypt" ? "EGP" : euCountries.includes(country) ? "EUR" : "USD");
  }, [country, setCurrency]);

  const handleChange = (event) => {
    localStorage.setItem("currency-manual", "true");
    setCurrency(event.target.value);
  };

  const active = currencyOptions.find((option) => option.value === currency) || currencyOptions[0];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="currency-selector" data-theme-mode={themeName}>
      <div className="currency-selector__label"><FaCoins aria-hidden="true" /><span>{t("currency")}</span></div>
      <Select value={active.value} onChange={handleChange} variant="standard" disableUnderline aria-label={t("currency")} renderValue={() => `${active.label} ${active.symbol}`}>
        {currencyOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label} {option.symbol}</MenuItem>)}
      </Select>
    </motion.div>
  );
}
