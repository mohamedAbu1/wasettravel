import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import CalendarBooking from "./components/CalendarBooking";
import BookingSummaryCard from "./components/BookingSummaryCard";
import { useChat } from "@/context/ChatContext";

const BookingCalendar = ({ trip }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const prise = trip.solo_price;
  const { themeName } = useTheme();
  const {
    participants,
    setParticipants,
    childrenCount,
    setChildrenCount,
    checkInPrice,
    setCheckInPrice,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
  } = useChat();
  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  return (
    <div
      className={`w-full lg:w-1/2 h-fit p-6 rounded-xl shadow-lg transition font-sans ${
        themeName === "dark"
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      {/* Participants Section */}
      <h2
        className={`text-xl font-semibold mb-4 ${
          themeName === "dark" ? "text-blue-400" : "text-primary"
        }`}
      >
        Participants
      </h2>

      <div className="flex justify-between mb-6">
        {/* Adults */}
        <div className="flex items-center space-x-1 lg:space-x-4">
          <div>
            <p className="font-medium">Adult</p>
            <p className="text-sm text-gray-500">Age 6 - 100</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setParticipants(Math.max(0, participants - 1))}
              className={`px-2 py-1 cursor-pointer rounded disabled:opacity-50 ${
                themeName === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
              disabled={participants === 0}
            >
              -
            </button>
            <span>{participants}</span>
            <button
              onClick={() => setParticipants(participants + 1)}
              className={`px-2 cursor-pointer py-1 rounded ${
                themeName === "dark"
                  ? "bg-yellow-500 text-black"
                  : "bg-yellow-500 text-white"
              }`}
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center space-x-1 lg:space-x-4">
          <div>
            <p className="font-medium">Child</p>
            <p className="text-sm text-gray-500">Age 6 - 12</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
              className={`px-2 cursor-pointer py-1 rounded disabled:opacity-50 ${
                themeName === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
              disabled={childrenCount === 0}
            >
              -
            </button>
            <span>{childrenCount}</span>
            <button
              onClick={() => setChildrenCount(childrenCount + 1)}
              className={`px-2 cursor-pointer py-1 rounded ${
                themeName === "dark"
                  ? "bg-yellow-500 text-black"
                  : "bg-yellow-500 text-white"
              }`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Section OR Message */}
      {participants === 0 ? (
        <div className="text-center py-10">
          <p
            className={`text-lg font-semibold ${
              themeName === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Please add participants to view available dates
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Select the number of adults or children to continue booking.
          </p>
        </div>
      ) : (
        <CalendarBooking
          prise={prise}
          checkInPrice={checkInPrice}
          setCheckInPrice={setCheckInPrice}
          setCheckOut={setCheckOut}
          checkOut={checkOut}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
        />
      )}

      <BookingSummaryCard
        checkInPrice={checkInPrice}
        participants={participants}
        childrenCount={childrenCount}
        checkOut={checkOut}
        checkIn={checkIn}
      />
    </div>
  );
};

export default BookingCalendar;
