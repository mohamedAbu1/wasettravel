"use client";
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [country, setCountry] = useState(null);

  const detectCountry = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        // استدعاء API لتحويل الإحداثيات إلى دولة
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (!res.ok) return;
        const data = await res.json();
        setCountry(data.countryName || null);
      });
    }
  };

  return (
    <AppContext.Provider value={{ country, detectCountry }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
