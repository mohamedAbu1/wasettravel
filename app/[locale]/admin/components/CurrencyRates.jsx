"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function CurrencyRates() {
  const { themeName } = useTheme();
  const [rates, setRates] = useState({ USD: 49.56, EUR: 59.65 });
  const [ids, setIds] = useState({ USD: null, EUR: null }); // ✅ تخزين الـ id لكل عملة
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("/api/currency");
        const data = await res.json();

        const usdRow = data.find((r) => r.currency === "USD");
        const eurRow = data.find((r) => r.currency === "EUR");

        setRates({
          USD: usdRow?.rate || 49.56,
          EUR: eurRow?.rate || 59.65,
        });

        setIds({
          USD: usdRow?.id || null,
          EUR: eurRow?.id || null,
        });
      } catch (err) {
        console.error("Error fetching rates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  // ✅ زر حفظ التغييرات باستخدام PUT
  const saveRates = async () => {
    setSaving(true);
    try {
      if (ids.USD) {
        await fetch("/api/currency", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: ids.USD, rate: rates.USD }),
        });
      }
      if (ids.EUR) {
        await fetch("/api/currency", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: ids.EUR, rate: rates.EUR }),
        });
      }
      alert("✅ تم حفظ التغييرات بنجاح");
    } catch (err) {
      alert("❌ حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center">⏳ Loading currency rates...</p>;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ USD Card */}
        <div
          className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg ${
            themeName === "dark"
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gold/30"
              : "bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300"
          }`}
        >
          <span className="text-5xl">🇺🇸</span>
          <h3 className="text-xl font-semibold mt-2">USD → EGP</h3>
          <input
            type="number"
            value={rates.USD}
            onChange={(e) =>
              setRates((prev) => ({ ...prev, USD: parseFloat(e.target.value) }))
            }
            className="mt-3 border rounded px-3 py-2 w-40 text-center dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* ✅ EUR Card */}
        <div
          className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg ${
            themeName === "dark"
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gold/30"
              : "bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300"
          }`}
        >
          <span className="text-5xl">🇪🇺</span>
          <h3 className="text-xl font-semibold mt-2">EUR → EGP</h3>
          <input
            type="number"
            value={rates.EUR}
            onChange={(e) =>
              setRates((prev) => ({ ...prev, EUR: parseFloat(e.target.value) }))
            }
            className="mt-3 border rounded px-3 py-2 w-40 text-center dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* ✅ زر الحفظ */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={saveRates}
          disabled={saving}
          className={`px-6 py-2 rounded-lg shadow-md font-semibold transition-transform ${
            themeName === "dark"
              ? "from-[#c9a34a] to-[#eab308] text-white hover:scale-105"
              : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] text-white hover:scale-105"
          }`}
        >
          {saving ? "⏳ Saving..." : "💾 Save Changes"}
        </button>
      </div>
    </div>
  );
}
