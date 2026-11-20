import React, { useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getAdultTripPrice } from "@/lib/tripPricing";

const pad = (value) => String(value).padStart(2, "0");
const dateKey = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;
const displayDate = (value) => {
  if (!value) return "Not Selected";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const CalendarBooking = ({
  trip,
  participants,
  tripCurrency,
  displayCurrency,
  convertPrice,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}) => {
  const { themeName } = useTheme();
  const now = new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, index) => index + 1), [daysInMonth]);
  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const price = getAdultTripPrice(trip, participants);
  const displayedPrice = convertPrice(price, tripCurrency, displayCurrency);

  const handleDateClick = (day) => {
    const selected = dateKey(year, month, day);
    if (selected < todayKey) return;

    if (checkIn === selected) {
      setCheckIn(null);
      setCheckOut(null);
      return;
    }
    if (checkOut === selected) {
      setCheckOut(null);
      return;
    }

    if (!checkIn || checkOut) {
      setCheckIn(selected);
      setCheckOut(null);
    } else if (selected > checkIn) {
      setCheckOut(selected);
    }
  };

  const changeMonth = (offset) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <div className={`trip-calendar max-w-2xl mx-auto p-6 rounded-xl shadow-lg transition font-sans ${themeName === "dark" ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100" : "bg-white/90 text-[#3a2c0a]"}`}>
      <div className="flex justify-between items-center mb-4">
        <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold">{visibleMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
        <button type="button" aria-label="Next month" onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}
        {days.map((day) => {
          const selected = dateKey(year, month, day);
          const isPast = selected < todayKey;
          const isCheckIn = checkIn === selected;
          const isCheckOut = checkOut === selected;
          const isBetween = Boolean(checkIn && checkOut && selected > checkIn && selected < checkOut);
          const isInvalid = Boolean(checkIn && !checkOut && selected <= checkIn);

          return (
            <div key={selected} className="flex flex-col items-center">
              <motion.button
                type="button"
                aria-label={`${displayDate(selected)} at ${displayedPrice} ${displayCurrency}`}
                onClick={() => !isPast && !isInvalid && handleDateClick(day)}
                disabled={isPast || isInvalid}
                whileHover={{ scale: isPast || isInvalid ? 1 : 1.1 }}
                whileTap={{ scale: isPast || isInvalid ? 1 : 0.9 }}
                className={`relative cursor-pointer w-10 h-10 rounded-lg transition ${
                  isPast || isInvalid
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-dashed border-gray-400"
                    : isCheckIn
                      ? "bg-blue-500 text-white shadow-md"
                      : isCheckOut
                        ? "bg-green-500 text-white shadow-md"
                        : isBetween
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : themeName === "dark"
                            ? "bg-gray-700 hover:bg-blue-600 hover:text-white"
                            : "bg-gray-50 hover:bg-blue-100"
                }`}
              >
                {day}
              </motion.button>
              {!isPast && !isInvalid && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{displayedPrice} {displayCurrency}</p>}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">Showing prices in {displayCurrency}</p>

      <div className="mt-6 grid grid-cols-2 gap-6 text-center">
        <div className={`p-4 rounded-lg shadow-md transition ${themeName === "dark" ? "bg-gray-800 text-gray-100" : "bg-blue-50 text-gray-700"}`}>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Check-in</h3>
          <p className="mt-2 text-lg font-bold">{displayDate(checkIn)}</p>
          {checkIn && <p className="mt-1 text-sm text-gray-500">Price per adult: {displayedPrice} {displayCurrency}</p>}
        </div>
        <div className={`p-4 rounded-lg shadow-md transition ${themeName === "dark" ? "bg-gray-800 text-gray-100" : "bg-green-50 text-gray-700"}`}>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Check-out</h3>
          <p className="mt-2 text-lg font-bold">{displayDate(checkOut)}</p>
        </div>
      </div>

      {(checkIn || checkOut) && (
        <div className="mt-6 flex justify-center">
          <motion.button type="button" onClick={() => { setCheckIn(null); setCheckOut(null); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 cursor-pointer rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition shadow-md">
            Clear All
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CalendarBooking;
