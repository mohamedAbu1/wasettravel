import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useCurrency } from "@/context/CurrencyContext";
import CalendarBooking from "./components/CalendarBooking";
import BookingSummaryCard from "./components/BookingSummaryCard";

const BookingCalendar = ({ trip, id, tripTitle }) => {
  const { themeName } = useTheme();
  const { currency } = usePurchase();
  const { convertPrice } = useCurrency();
  const [participants, setParticipants] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const tripCurrency = String(trip?.currency || "USD").toUpperCase();
  const displayCurrency = String(currency || tripCurrency).toUpperCase();

  useEffect(() => {
    setParticipants(0);
    setChildrenCount(0);
    setCheckIn(null);
    setCheckOut(null);
  }, [id]);

  return (
    <div
      className={`trip-detail-panel h-fit w-full rounded-xl p-4 font-sans shadow-lg transition sm:p-6 ${
        themeName === "dark"
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      <h2 className={`text-xl font-semibold mb-4 ${themeName === "dark" ? "text-blue-400" : "text-primary"}`}>
        Participants
      </h2>

      <div className="flex justify-between mb-6">
        <div className="flex items-center space-x-1 lg:space-x-4">
          <div>
            <p className="font-medium">Adult</p>
            <p className="text-sm text-gray-500">Per person</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setParticipants(Math.max(0, participants - 1))}
              className="px-2 py-1 cursor-pointer rounded disabled:opacity-50 bg-blue-600 text-white"
              disabled={participants === 0}
            >
              -
            </button>
            <span>{participants}</span>
            <button
              type="button"
              onClick={() => setParticipants(participants + 1)}
              className={`px-2 cursor-pointer py-1 rounded ${themeName === "dark" ? "bg-yellow-500 text-black" : "bg-yellow-500 text-white"}`}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1 lg:space-x-4">
          <div>
            <p className="font-medium">Child</p>
            <p className="text-sm text-gray-500">Child fare</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
              className="px-2 cursor-pointer py-1 rounded disabled:opacity-50 bg-blue-600 text-white"
              disabled={childrenCount === 0}
            >
              -
            </button>
            <span>{childrenCount}</span>
            <button
              type="button"
              onClick={() => setChildrenCount(childrenCount + 1)}
              className={`px-2 cursor-pointer py-1 rounded ${themeName === "dark" ? "bg-yellow-500 text-black" : "bg-yellow-500 text-white"}`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {participants === 0 ? (
        <div className="text-center py-10">
          <p className={`text-lg font-semibold ${themeName === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Please add participants to view available dates
          </p>
          <p className="text-sm text-gray-500 mt-2">Select the number of adults to continue booking.</p>
        </div>
      ) : (
        <CalendarBooking
          trip={trip}
          displayCurrency={displayCurrency}
          tripCurrency={tripCurrency}
          convertPrice={convertPrice}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          participants={participants}
        />
      )}

      <BookingSummaryCard
        trip={trip}
        tripTitle={tripTitle}
        participants={participants}
        childrenCount={childrenCount}
        checkOut={checkOut}
        checkIn={checkIn}
        currency={displayCurrency}
        tripCurrency={tripCurrency}
        convertPrice={convertPrice}
      />
    </div>
  );
};

export default BookingCalendar;
