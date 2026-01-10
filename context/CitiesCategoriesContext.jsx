// file: context/CitiesCategoriesContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const CitiesCategoriesContext = createContext();

export function CitiesCategoriesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/categories"),
        ]);

        const citiesData = await citiesRes.json();
        const categoriesData = await categoriesRes.json();

        if (citiesData.success) setCities(citiesData.cities);
        if (categoriesData.success) setCategories(categoriesData.categories);
      } catch (err) {
        console.error("Error fetching cities/categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CitiesCategoriesContext.Provider value={{ cities, categories, loading }}>
      {children}
    </CitiesCategoriesContext.Provider>
  );
}

// Hook للاستخدام داخل أي كومبوننت
export const useCitiesCategories = () => useContext(CitiesCategoriesContext);
