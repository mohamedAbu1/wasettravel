"use client";
import { FaTimes } from "react-icons/fa";
import TravelerInfo from "./TravelerInfo";
import AdditionalDetails from "./AdditionalDetails";
import TripDetails from "./TripDetails";
import ConfirmButton from "./ConfirmButton";
import TripSchedule from "./TripSchedule"; // ✅ الكومبوننت الجديد
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function PurchaseModal({ trip, onClose }) {
  const { themeName } = useTheme();

  // ✅ State للجدول الزمني
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [hasGuide, setHasGuide] = useState(false);
  const [guideLanguages, setGuideLanguages] = useState([]);

  const [hasPets, setHasPets] = useState(false);
  const [pets, setPets] = useState([]); // ممكن تكون ["cat", "dog"]

  const [groupSize, setGroupSize] = useState(1);

  const modalClasses =
    themeName === "dark"
      ? "bg-gradient-to-b from-gray-800 via-gray-900 to-black text-yellow-300 z-55"
      : "bg-gradient-to-b from-white via-gray-100 to-white text-gray-900 z-55";

  return (
    <div className="fixed inset-0 z-54 flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm transition-opacity animate-fadeIn sm:items-center sm:p-6">
      <div
        className={`relative mt-3 max-h-[calc(100dvh-1.5rem)] w-full max-w-[1000px] overflow-y-auto rounded-2xl p-5 shadow-2xl transform animate-slideUp sm:mt-12 sm:max-h-[calc(100dvh-3rem)] sm:p-8 ${modalClasses}`}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer transition"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* الأقسام */}
        <TravelerInfo />
        <TripSchedule
          arrivalDate={arrivalDate}
          setArrivalDate={setArrivalDate}
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
        />
        <AdditionalDetails
          hasChildren={hasChildren}
          setHasChildren={setHasChildren}
          childrenCount={childrenCount}
          setChildrenCount={setChildrenCount}
          hasPets={hasPets}
          setHasPets={setHasPets}
          pets={pets}
          setPets={setPets}
          groupSize={groupSize}
          setGroupSize={setGroupSize}
          hasGuide={hasGuide}
          setHasGuide={setHasGuide}
          guideLanguages={guideLanguages}
          setGuideLanguages={setGuideLanguages}
        />

        <TripDetails trip={trip} groupSize={groupSize} />
        <ConfirmButton
          trip={trip.id}
          tripTitle={trip.title?.en || trip.title || "Egypt tour"}
          onClose={onClose}
          arrivalDate={arrivalDate}
          departureDate={departureDate}
          hasChildren={hasChildren}
          childrenCount={childrenCount}
          hasPets={hasPets}
          pets={pets}
          groupSize={groupSize}
          hasGuide={hasGuide}
          guideLanguages={guideLanguages}
        />
      </div>
    </div>
  );
}
