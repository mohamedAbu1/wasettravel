"use client";
import { v4 as uuidv4 } from "uuid";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const TripContext = createContext();

const emptyTrip = {
  title: { en: "", es: "", fr: "", de: "", it: "", zh: "" },
  description: { en: "", es: "", fr: "", de: "", it: "", zh: "" },
  currency: "USD",
  duration: 0,
  duration_unit: "days",
  priceLevel: "",
  cover_image: "", // رابط دائم من السيرفر
  cover_file: null, // الملف نفسه قبل الرفع
  cover_name: "",
  gallery_images: [], // روابط الصور بعد الرفع
  gallery_files: [], // الملفات نفسها قبل الرفع
  cities: [],
  categories: [],
  includes: [],
  exclusions: [],
  itinerary: [],
  solo_price: 0,
  group_price: 0,
  discountPercent: 0,
  details: [], // ✅ تفاصيل الرحلة الجديدة
};

export function TripProvider({ children }) {
  const [tripData, setTripData] = useState(emptyTrip);
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [error, setError] = useState(null);
  const savingRef = useRef(false);

  const updateTripField = (field, value) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ رفع صورة الغلاف
  const uploadCover = async (file) => {
    const formData = new FormData();
    formData.append("cover_image", file);

    const res = await fetch("/api/cover", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Upload cover failed");
    return result.cover_image; // رابط الغلاف بعد الرفع
  };

  const uploadGallery = async () => {
    const formData = new FormData();

    tripData.gallery_files.forEach((file, index) => {
      formData.append("gallery_images", file);

      const names = tripData.gallery_images[index]?.name || {};
      formData.append(`name_en_${index}`, names.en || file.name);
      formData.append(`name_ar_${index}`, names.ar || "");
      formData.append(`name_fr_${index}`, names.fr || "");
      formData.append(`name_de_${index}`, names.de || "");
      formData.append(`name_it_${index}`, names.it || "");
      formData.append(`name_zh_${index}`, names.zh || "");
      formData.append(`name_es_${index}`, names.es || "");
    });

    const res = await fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!result.success)
      throw new Error(result.error || "Upload gallery failed");
    return result.gallery_images; // ✅ رجّع المصفوفة مباشرة
  };
  const addDetail = (optionKey, translations) => {
    setTripData((prev) => {
      if ((prev.details || []).some((detail) => detail.option_key === optionKey)) return prev;
      return {
        ...prev,
        details: [
          ...(prev.details || []),
          {
            id: uuidv4(),
            option_key: optionKey,
            translations,
            values: Object.keys(translations).reduce((acc, lang) => {
              acc[lang] = "";
              return acc;
            }, {}),
          },
        ],
      };
    });
  };

  const updateDetail = (optionKey, lang, value) => {
    setTripData((prev) => ({
      ...prev,
      details: prev.details.map((d) =>
        d.option_key === optionKey
          ? { ...d, values: { ...d.values, [lang]: value } }
          : d,
      ),
    }));
  };

  const removeDetail = (optionKey) => {
    setTripData((prev) => ({
      ...prev,
      details: prev.details.filter((d) => d.option_key !== optionKey),
    }));
  };
const saveTrip = async () => {
  if (savingRef.current) {
    return { success: false, error: "A trip is already being saved. Please wait." };
  }
  savingRef.current = true;
  try {
    setError(null);

    let coverUrl = tripData.cover_image;
    if (tripData.cover_file) {
      coverUrl = await uploadCover(tripData.cover_file);
    }

    let galleryData = (tripData.gallery_images || [])
      .filter((image) => image && image.url && !String(image.url).startsWith("blob:"))
      .map(({ url, name }) => ({ url, name: name || {} }));
    if (tripData.gallery_files?.length > 0) {
      galleryData = await uploadGallery();
    }

    const payload = {
      ...tripData,
      cover_image: coverUrl,
      gallery_images: galleryData,
      exclusions: tripData.exclusions,
      details: tripData.details, // ✅ إرسال تفاصيل الرحلة
    };

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.error || `Unable to save trip (${res.status}).`);
    }

    setTripData(emptyTrip);

    return result;
  } catch (err) {
    setError(err.message);
    return { success: false, error: err.message };
  } finally {
    savingRef.current = false;
  }
};


  // ✅ جلب الرحلات
  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    setError(null);
    try {
      const res = await fetch("/api/trips", { cache: "no-store" });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || "Unable to load trips.");
      const nextTrips = Array.isArray(result.trips) ? result.trips : [];
      setTrips(nextTrips);
      localStorage.setItem("trips", JSON.stringify(nextTrips));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  const getTripById = (id) => {
    return trips.find((trip) => String(trip.id) === String(id));
  };
  return (
    <TripContext.Provider
      value={{
        tripData,
        updateTripField,
        saveTrip,
        setTripData,
        trips,
        fetchTrips,
        loadingTrips,
        getTripById,
        uploadCover,
        setTrips,
        uploadGallery,
        addDetail, // ✅
        updateDetail, // ✅
        removeDetail, // ✅
        error,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
