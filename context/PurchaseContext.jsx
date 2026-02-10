"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PurchaseContext = createContext();

export function PurchaseProvider({ children }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ جلب المشتريات من API
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/purchases"); // لازم تعمل route خاص بجلب المشتريات
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

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <PurchaseContext.Provider
      value={{ purchases, loading, purchaseTrip, fetchPurchases }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export const usePurchase = () => useContext(PurchaseContext);
