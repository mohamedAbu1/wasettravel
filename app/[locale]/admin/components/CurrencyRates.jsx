"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function CurrencyRates() {
  const { themeName } = useTheme();
  const [rates, setRates] = useState({
    USD_EGP: 50.36,
    USD_EUR: 0.87,
    EUR_EGP: 58.09,
    EGP_USD: 0.0199,
    EGP_EUR: 0.0172,
    EUR_USD: 1.15,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("/api/currency");
        const data = await res.json();

        const findRate = (base, target) =>
          data.find(
            (r) => r.base_currency === base && r.target_currency === target,
          )?.rate || 0;

        setRates({
          USD_EGP: findRate("USD", "EGP"),
          USD_EUR: findRate("USD", "EUR"),
          EUR_EGP: findRate("EUR", "EGP"),
          EGP_USD: findRate("EGP", "USD"),
          EGP_EUR: findRate("EGP", "EUR"),
          EUR_USD: findRate("EUR", "USD"),
        });
      } catch (err) {
        console.error("Error fetching rates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  // ✅ زر حفظ التغييرات
  const saveRates = async () => {
    setSaving(true);
    try {
      const updates = [
        { base: "USD", target: "EGP", rate: rates.USD_EGP },
        { base: "USD", target: "EUR", rate: rates.USD_EUR },
        { base: "EUR", target: "EGP", rate: rates.EUR_EGP },
        { base: "EGP", target: "USD", rate: rates.EGP_USD },
        { base: "EGP", target: "EUR", rate: rates.EGP_EUR },
        { base: "EUR", target: "USD", rate: rates.EUR_USD },
      ];

      for (const u of updates) {
        await fetch("/api/currency", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base_currency: u.base,
            target_currency: u.target,
            rate: u.rate,
          }),
        });
      }

      alert("✅ تم حفظ جميع التغييرات بنجاح");
    } catch (err) {
      alert("❌ حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center">⏳ Loading currency rates...</p>;

  const renderCard = (flag, label, value, onChange) => (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg ${
        themeName === "dark"
          ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gold/30"
          : "bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300"
      }`}
    >
      <span className="text-5xl">{flag}</span>
      <h3 className="text-xl font-semibold mt-2">{label}</h3>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-3 border rounded px-3 py-2 w-40 text-center dark:bg-gray-800 dark:text-white"
      />
    </div>
  );

  return (
    <div
      className={`p-6 rounded-xl shadow-lg ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-white"
          : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-6 text-center ${
          themeName === "dark"
            ? "text-gold"
            : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
        }`}
      >
        💱 Currency Rates
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderCard("🇺🇸", "USD → EGP", rates.USD_EGP, (val) =>
          setRates((prev) => ({ ...prev, USD_EGP: val })),
        )}
        {renderCard("🇺🇸", "USD → EUR", rates.USD_EUR, (val) =>
          setRates((prev) => ({ ...prev, USD_EUR: val })),
        )}
        {renderCard("🇪🇺", "EUR → EGP", rates.EUR_EGP, (val) =>
          setRates((prev) => ({ ...prev, EUR_EGP: val })),
        )}
        {renderCard("🇪🇬", "EGP → USD", rates.EGP_USD, (val) =>
          setRates((prev) => ({ ...prev, EGP_USD: val })),
        )}
        {renderCard("🇪🇬", "EGP → EUR", rates.EGP_EUR, (val) =>
          setRates((prev) => ({ ...prev, EGP_EUR: val })),
        )}
        {renderCard("🇪🇺", "EUR → USD", rates.EUR_USD, (val) =>
          setRates((prev) => ({ ...prev, EUR_USD: val })),
        )}
      </div>

      {/* ✅ زر الحفظ */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={saveRates}
          disabled={saving}
          className={`px-6 py-2 rounded-lg shadow-md font-semibold transition-transform ${
            themeName === "dark"
              ? "bg-gold text-black hover:scale-105"
              : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] text-white hover:scale-105"
          }`}
        >
          {saving ? "⏳ Saving..." : "💾 Save Changes"}
        </button>
      </div>
    </div>
  );
}
