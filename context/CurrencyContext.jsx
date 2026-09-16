"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CurrencyContext = createContext(null);
const supportedCurrencies = ["USD", "EUR", "EGP"];
const fallbackRates = {
  USD_EUR: 0.86,
  USD_EGP: 51.34,
  EUR_EGP: 58.6,
};

function createRateMap(rows = []) {
  const next = { ...fallbackRates };
  rows.forEach((row) => {
    const base = String(row.base_currency || "").toUpperCase();
    const target = String(row.target_currency || "").toUpperCase();
    const rate = Number(row.rate);
    if (supportedCurrencies.includes(base) && supportedCurrencies.includes(target) && base !== target && Number.isFinite(rate) && rate > 0) {
      next[`${base}_${target}`] = rate;
    }
  });
  // Keep only three canonical rates and derive inverses, so every screen uses the same source.
  if (next.USD_EUR) next.EUR_USD = 1 / next.USD_EUR;
  if (next.USD_EGP) next.EGP_USD = 1 / next.USD_EGP;
  if (next.EUR_EGP) next.EGP_EUR = 1 / next.EUR_EGP;
  return next;
}

export function CurrencyProvider({ children }) {
  const [rates, setRates] = useState(() => createRateMap());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const refreshRates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/currency", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load currency rates");
      const data = await response.json();
      const nextRows = Array.isArray(data) ? data : data.rows || [];
      setRows(nextRows);
      setRates(createRateMap(nextRows));
      setError(null);
      return nextRows;
    } catch (requestError) {
      setError(requestError.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshRates(); }, [refreshRates]);

  const convertPrice = useCallback((amount, fromCurrency, toCurrency, decimals = 2) => {
    const numericAmount = Number(amount);
    const from = String(fromCurrency || "USD").toUpperCase();
    const to = String(toCurrency || from).toUpperCase();
    if (!Number.isFinite(numericAmount) || from === to) return Number.isFinite(numericAmount) ? numericAmount.toFixed(decimals) : "0.00";
    const direct = rates[`${from}_${to}`];
    const converted = direct ? numericAmount * direct : numericAmount;
    return converted.toFixed(decimals);
  }, [rates]);

  const saveRates = useCallback(async (nextRates) => {
    setSaving(true);
    try {
      const payload = [
        ["USD", "EUR", nextRates.USD_EUR], ["USD", "EGP", nextRates.USD_EGP], ["EUR", "EGP", nextRates.EUR_EGP],
      ];
      const responses = await Promise.all(payload.map(([base_currency, target_currency, rate]) => fetch("/api/currency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ base_currency, target_currency, rate }),
      })));
      if (responses.some((response) => !response.ok)) throw new Error("One or more rates could not be saved");
      await refreshRates();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [refreshRates]);

  const value = useMemo(() => ({ rates, rows, loading, saving, error, refreshRates, saveRates, convertPrice }), [rates, rows, loading, saving, error, refreshRates, saveRates, convertPrice]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => useContext(CurrencyContext);
