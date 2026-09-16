"use client";
import React, { useState } from "react";
import { useTrip } from "../../context/TripContext";

export default function SaveButton() {
  const { tripData, saveTrip } = useTrip();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setStatus(null);
    setErrorMessage("");

    // ✅ تتبع قبل الحفظ
    console.log("➡️ SaveButton clicked");
    console.log("➡️ Current tripData:", tripData);

    try {
      const res = await saveTrip();

      // ✅ تتبع بعد استدعاء saveTrip
      console.log("✅ API response:", res);

      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Please review the required fields and try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Unable to save this trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleSave}
        disabled={
          !tripData.title.en ||
          !tripData.description.en ||
          Number(tripData.solo_price) <= 0 ||
          !tripData.duration ||
          !tripData.priceLevel ||
          tripData.cities.length === 0 ||
          tripData.categories.length === 0
        }
        className={`w-full py-3 rounded-lg font-bold transition shadow-lg 
          ${
            loading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-[#c9a34a] text-black hover:bg-yellow-500"
          }
        `}
      >
        {loading ? "Saving..." : "Save Trip"}
      </button>

      {status === "success" && (
        <p className="mt-2 text-green-600 font-semibold">
          Trip saved successfully ✅
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-red-600 font-semibold">{errorMessage || "Error saving trip ❌"}</p>
      )}
    </div>
  );
}
