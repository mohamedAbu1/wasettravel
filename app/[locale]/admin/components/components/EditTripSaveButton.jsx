"use client";
import React, { useState } from "react";
import { useTripID } from "../../context/TripIDContext";

const EditTripSaveButton = () => {
  const { tripData, saveTrip, loading } = useTripID();
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  // ✅ حفظ التعديلات
  const handleSave = async () => {
    if (saving || loading) return;
    setSaving(true);
    setStatus(null);
    try {
      const result = await saveTrip();
      setStatus(result.success ? "success" : "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{marginTop:"20px"}} className="w-full">
      <button
        type="button"
        onClick={handleSave}
        disabled={loading || saving}
       
        className={`w-full py-3 rounded-lg font-bold transition shadow-lg 
          ${
            loading || saving
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-[#c9a34a] text-black hover:bg-yellow-500"
          }
        `}
      >
        {loading || saving ? "Saving..." : "Save Trip"}
      </button>

      {status === "success" && (
        <p className="mt-2 text-green-600 font-semibold">
          Trip saved successfully ✅
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-red-600 font-semibold">Error saving trip ❌</p>
      )}
    </div>
  );
};

export default EditTripSaveButton;
