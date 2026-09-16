// file: context/CitiesCategoriesContext.js
"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fallbackCities, fallbackCategories } from "@/lib/catalogFallback";

const CitiesCategoriesContext = createContext();

export function CitiesCategoriesProvider({ children }) {
  const [cities, setCities] = useState(fallbackCities);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(false);

  const { i18n } = useTranslation(); // اللغة الحالية للموقع
  const getLangKey = (lang) => lang.split("-")[0];
  const normalizedLang = getLangKey(i18n.language);

  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          fetch("/api/cities", { signal: controller.signal }),
          fetch("/api/categories", { signal: controller.signal }),
        ]);

        const citiesData = await citiesRes.json();
        const categoriesData = await categoriesRes.json();

        if (citiesData.success) setCities(citiesData.cities);
        if (categoriesData.success && categoriesData.categories?.length) setCategories(categoriesData.categories);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Error fetching cities/categories:", err);
      } finally {
        window.clearTimeout(timeout);
      }
    };

    fetchData();
  }, []);

  // ✅ فلترة المدن وتحويل الحقول من JSON string إلى كائن/مصفوفة
 // ✅ فلترة المدن وتحويل الحقول من JSON string إلى كائن/مصفوفة
const localizedCities = cities.map((city) => {
  let parsedName = {};
  let parsedImages = [];

  try {
    parsedName = JSON.parse(city.name); // ← استخدم name بدل translations
  } catch {
    parsedName = { en: city.name };
  }

  try {
    parsedImages = JSON.parse(city.images);
  } catch {
    parsedImages = ["/HomePageImage/_16934_1.webp"];
  }

  return {
    ...city,
    name:
      parsedName?.[normalizedLang] ||
      parsedName?.["en"] ||
      Object.values(parsedName)[0] ||
      city.name,
    images: Array.isArray(parsedImages) ? parsedImages : ["/HomePageImage/_16934_1.webp"],
  };
});


  // ✅ فلترة الكاتجري بنفس الأسلوب
  const localizedCategories = categories.map((cat) => {
    let parsedName = {};
    let parsedImages = [];

    try {
      parsedName = JSON.parse(cat.name);
    } catch {
      parsedName = { en: cat.name };
    }

    try {
      parsedImages = JSON.parse(cat.images);
    } catch {
    parsedImages = ["/HomePageImage/_16934_1.webp"];
    }

    return {
      ...cat,
      name:
        parsedName?.[normalizedLang] ||
        parsedName?.["en"] ||
        Object.values(parsedName)[0] ||
        cat.name,
    images: Array.isArray(parsedImages) ? parsedImages : ["/HomePageImage/_16934_1.webp"],
    };
  });

  return (
    <CitiesCategoriesContext.Provider
      value={{
        cities: localizedCities,
        categories: localizedCategories,
        loading,
      }}
    >
      {children}
    </CitiesCategoriesContext.Provider>
  );
}

export const useCitiesCategories = () => useContext(CitiesCategoriesContext);
