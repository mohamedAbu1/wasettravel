"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PurchaseContext = createContext();

export function PurchaseProvider({ children }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(""); // القيمة الافتراضية

  // ✅ جلب المشتريات من API
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/purchases");
      setPurchases(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // ✅ شراء رحلة جديدة
  const purchaseTrip = async (tripId) => {
    try {
      const res = await axios.post("/api/purchase", { tripId });
      if (res.status === 200) {
        await fetchPurchases();
        return { success: true };
      } else {
        return { error: res.data.error };
      }
    } catch (err) {
      return { error: err.response?.data?.error || "Server error" };
    }
  };

  // ✅ تحميل العملة من localStorage عند أول تشغيل فقط
useEffect(() => {
  const savedCurrency = localStorage.getItem("currency");
  if (savedCurrency) {
    setCurrency(savedCurrency); // يضبط العملة المخزنة
  } else {
    setCurrency("USD"); // يضبط الدولار كافتراضي لو ما فيش قيمة
    localStorage.setItem("currency", "USD"); // يخزنها في الاستورج
  }
  fetchPurchases();
}, []);


  // ✅ حفظ العملة في localStorage عند تغييرها
  useEffect(() => {
    if (currency) {
      localStorage.setItem("currency", currency);
    }
  }, [currency]); // ✅ هذا يشتغل كل مرة تتغير العملة

  return (
    <PurchaseContext.Provider
      value={{ purchases, loading, purchaseTrip, fetchPurchases, currency, setCurrency }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export const usePurchase = () => useContext(PurchaseContext);
