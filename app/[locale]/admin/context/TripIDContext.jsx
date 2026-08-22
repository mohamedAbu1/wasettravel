"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TripIDContext = createContext();

export function TripIDProvider({ children }) {
  const [tripsList, setTripsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripData, setTripData] = useState({ trip_details: [] });

  // ✅ استدعاء جميع الرحلات
  const fetchAllTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = localStorage.getItem("tripsList");
      if (cached) setTripsList(JSON.parse(cached));

      const res = await fetch("/api/trips", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();

      if (res.ok) {
        const titles = (data.trips || []).map((trip) => ({
          id: trip.id,
          title:
            typeof trip.title === "object"
              ? trip.title.en || Object.values(trip.title)[0]
              : trip.title || "Untitled",
        }));
        setTripsList(titles);
        localStorage.setItem("tripsList", JSON.stringify(titles));
      } else setError(data.error || "Failed to fetch trips");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ استدعاء رحلة واحدة بالـ ID
  const fetchTripById = async (id) => {
    if (!id) return setError("No trip ID provided");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/trips/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();

      if (res.ok) {
        setTripData({
          ...data.trip,
          discountPercent: data.trip.discount_percent,
          title:
            typeof data.trip.title === "string"
              ? JSON.parse(data.trip.title)
              : data.trip.title,
          description:
            typeof data.trip.description === "string"
              ? JSON.parse(data.trip.description)
              : data.trip.description,
          gallery_images: Array.isArray(data.trip.gallery_images)
            ? data.trip.gallery_images
            : JSON.parse(data.trip.gallery_images || "[]"),
          includes: Array.isArray(data.trip.includes)
            ? data.trip.includes.map((inc) => ({
                id: inc.id,
                include_translations:
                  typeof inc.include_translations === "string"
                    ? JSON.parse(inc.include_translations)
                    : inc.include_translations,
              }))
            : [],
          exclusions: Array.isArray(data.trip.exclusions)
            ? data.trip.exclusions.map((exc) => ({
                id: exc.id,
                exclusions_translations:
                  typeof exc.exclusions_translations === "string"
                    ? JSON.parse(exc.exclusions_translations)
                    : exc.exclusions_translations,
              }))
            : [],
          trip_details: Array.isArray(data.trip.trip_details)
            ? data.trip.trip_details.map((detail) => ({
                id: detail.id,
                option_key: detail.option_key,
                translations:
                  typeof detail.translations === "string"
                    ? JSON.parse(detail.translations)
                    : detail.translations,
                detail_values:
                  typeof detail.detail_values === "string"
                    ? JSON.parse(detail.detail_values)
                    : detail.detail_values,
              }))
            : [],
        });
      } else setError(data.error || "Failed to fetch trip");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ حذف الرحلة
  const deleteTrip = async (id) => {
    try {
      const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setTripsList((prev) => prev.filter((trip) => trip.id !== id));
        localStorage.setItem(
          "tripsList",
          JSON.stringify(tripsList.filter((trip) => trip.id !== id)),
        );
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ✅ تحديث أي حقل داخل الرحلة
  const updateTripField = (field, value) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ إضافة include جديد
  const addInclude = (translationObj) => {
    setTripData((prev) => ({
      ...prev,
      includes: [
        ...(prev.includes || []),
        { id: uuidv4(), include_translations: translationObj },
      ],
    }));
  };

  const updateTripDetails = (optionKey, translations, detail_values) => {
    setTripData((prev) => {
      if (!prev) return { trip_details: [] }; // حماية
      const existing = prev?.trip_details?.find(
        (d) => d.option_key === optionKey,
      );
      if (existing) {
        const updated = prev.trip_details.map((d) =>
          d.option_key === optionKey ? { ...d, translations, detail_values } : d,
        );
        return { ...prev, trip_details: updated };
      } else {
        const newDetail = {
          id: uuidv4(),
          option_key: optionKey,
          translations,
          detail_values,
        };
        return {
          ...prev,
          trip_details: [...(prev.trip_details || []), newDetail],
        };
      }
    });
  };

  // ✅ حفظ الرحلة
  const saveTrip = async () => {
    if (!tripData?.id) return { success: false, error: "No trip ID" };

    const tripPayload = {
      title: tripData.title,
      description: tripData.description,
      duration: tripData.duration,
      priceLevel: tripData.priceLevel,
      cover_image: tripData.cover_image,
      gallery_images: tripData.gallery_images,
      solo_price: tripData.solo_price,
      group_price: tripData.group_price,
      discountPercent: tripData.discountPercent,
      categories: (tripData.categories || []).map((c) =>
        typeof c === "string" ? c : c?.category_id || c?.id,
      ),
      cities: (tripData.cities || []).map((c) =>
        typeof c === "string" ? c : c?.city_id || c?.id,
      ),
      includes: (tripData.includes || []).map((inc) => ({
        id: inc.id,
        include_translations: inc.include_translations,
      })),
      exclusions: (tripData.exclusions || []).map((exc) => ({
        id: exc.id,
        exclusions_translations: exc.exclusions_translations,
      })),
      itinerary: tripData.itinerary || [],
      details: tripData.trip_details || [], // ✅ إرسال تفاصيل الرحلة
    };

    try {
      const res = await fetch(`/api/trips/${tripData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripPayload),
      });
      const data = await res.json();

      if (data.success) setTripData(null);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchAllTrips();
  }, []);

  return (
    <TripIDContext.Provider
      value={{
        tripData,
        tripsList,
        setTripData,
        fetchTripById,
        fetchAllTrips,
        updateTripField,
        addInclude,
        updateTripDetails, // ✅ متاح للاستخدام في أي كومبوننت
        saveTrip,
        deleteTrip,
        loading,
        error,
      }}
    >
      {children}
    </TripIDContext.Provider>
  );
}

export const useTripID = () => useContext(TripIDContext);
