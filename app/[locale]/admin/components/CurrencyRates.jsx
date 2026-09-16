"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaExchangeAlt, FaRedoAlt, FaSave } from "react-icons/fa";
import { useCurrency } from "@/context/CurrencyContext";

const pairs = [
  { base: "USD", target: "EUR", label: "US Dollar → Euro" },
  { base: "USD", target: "EGP", label: "US Dollar → Egyptian Pound" },
  { base: "EUR", target: "EGP", label: "Euro → Egyptian Pound" },
];

export default function CurrencyRates() {
  const { rates, loading, saving, error, refreshRates, saveRates } = useCurrency();
  const [draft, setDraft] = useState({ USD_EUR: "", USD_EGP: "", EUR_EGP: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft({ USD_EUR: rates.USD_EUR ?? "", USD_EGP: rates.USD_EGP ?? "", EUR_EGP: rates.EUR_EGP ?? "" });
  }, [rates]);

  const update = (key, value) => {
    setMessage("");
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    const values = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, Number(value)]));
    if (Object.values(values).some((value) => !Number.isFinite(value) || value <= 0)) {
      setMessage("Enter a valid positive rate for every pair.");
      return;
    }
    const success = await saveRates(values);
    setMessage(success ? "Rates saved and published successfully." : "Unable to save rates. Please try again.");
  };

  if (loading) return <div className="admin-currency-card">Loading currency settings…</div>;

  return (
    <section className="admin-currency-card" aria-labelledby="currency-settings-title">
      <div className="admin-currency-card__header">
        <div><span className="admin-currency-card__eyebrow">Pricing control</span><h2 id="currency-settings-title">Currency rates</h2><p>Set the three live base rates. Reverse conversions are calculated automatically.</p></div>
        <button type="button" className="admin-currency-refresh" onClick={() => { setMessage(""); refreshRates(); }} disabled={saving}><FaRedoAlt /> Refresh</button>
      </div>
      <div className="admin-currency-notice"><FaExchangeAlt /><span>All customer-facing prices use these values across trips, details, filters, and booking summaries.</span></div>
      <div className="admin-currency-grid">
        {pairs.map((pair) => {
          const key = `${pair.base}_${pair.target}`;
          return <label key={key} className="admin-currency-field"><span>{pair.label}</span><div><input type="number" min="0.000001" step="0.0001" inputMode="decimal" value={draft[key]} onChange={(event) => update(key, event.target.value)} aria-label={pair.label} /><strong>{pair.target}</strong></div><small>1 {pair.base} = {draft[key] || "—"} {pair.target}</small></label>;
        })}
      </div>
      {error ? <p className="admin-currency-error" role="alert">{error}</p> : null}
      {message ? <p className={`admin-currency-message ${message.includes("Unable") || message.includes("valid") ? "is-error" : ""}`} role="status">{message.includes("successfully") ? <FaCheckCircle /> : null}{message}</p> : null}
      <div className="admin-currency-card__footer"><span>Changes apply after saving and refresh automatically for visitors.</span><button type="button" className="admin-currency-save" onClick={handleSave} disabled={saving}><FaSave /> {saving ? "Saving…" : "Save & publish"}</button></div>
    </section>
  );
}
