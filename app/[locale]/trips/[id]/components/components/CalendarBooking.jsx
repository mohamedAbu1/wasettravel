import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

const CalendarBooking = ({
  prise,
  setCheckInPrice,
  checkInPrice,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}) => {
  const { themeName } = useTheme();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const year = new Date().getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const [prices, setPrices] = useState([]);
  const [guests, setGuests] = useState(0); // ✅ عدد الأشخاص

  // توليد أسعار جديدة
// توليد أسعار جديدة مرتبطة بسعر الفرد ±6 دولار
const generatePrices = () => {
  return Array.from({ length: daysInMonth }, () => {
    const variation = Math.floor(Math.random() * 13) - 6; 
    // من -6 إلى +6
    return prise + variation;
  });
};


  // تحميل الأسعار من localStorage أو توليد جديدة لو مر 24 ساعة
  useEffect(() => {
    const savedData = localStorage.getItem("calendarPrices");
    const savedTime = localStorage.getItem("calendarPricesTime");

    if (savedData && savedTime) {
      const lastUpdate = new Date(savedTime);
      const now = new Date();
      const diffHours = (now - lastUpdate) / (1000 * 60 * 60);

      if (diffHours < 24) {
        setPrices(JSON.parse(savedData));
        return;
      }
    }

    const newPrices = generatePrices();
    setPrices(newPrices);
    localStorage.setItem("calendarPrices", JSON.stringify(newPrices));
    localStorage.setItem("calendarPricesTime", new Date().toISOString());
  }, [currentMonth, prise]);

  const handleDateClick = (day, price) => {
    const selectedDate = new Date(year, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) return;

    const selected = `${day} ${months[currentMonth]} ${year}`;

    if (checkIn === selected) {
      setCheckIn(null);
      setCheckInPrice(null);
      return;
    }
    if (checkOut === selected) {
      setCheckOut(null);
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(selected);
      setCheckInPrice(price);
      setCheckOut(null);
    } else if (!checkOut) {
      const checkInDate = new Date(checkIn);
      if (selectedDate > checkInDate) {
        setCheckOut(selected);
      }
    }
  };

  const prevMonth = () =>
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  const nextMonth = () =>
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));

  return (
    <div
      className={`max-w-2xl mx-auto p-6 rounded-xl shadow-lg transition font-sans ${
        themeName === "dark"
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100"
          : "bg-white/90 text-[#3a2c0a]"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold">
          {months[currentMonth]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day, index) => {
          const selectedDate = new Date(year, currentMonth, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPast = selectedDate < today;

          const selected = `${day} ${months[currentMonth]} ${year}`;
          const isCheckIn = checkIn === selected;
          const isCheckOut = checkOut === selected;
          const price = prices[index];

          let isBetween = false;
          if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            isBetween =
              selectedDate > checkInDate && selectedDate < checkOutDate;
          }

          let isInvalid = false;
          if (checkIn && !checkOut && selectedDate <= new Date(checkIn)) {
            isInvalid = true;
          }
          if (checkOut && !checkIn && selectedDate >= new Date(checkOut)) {
            isInvalid = true;
          }

          return (
            <div key={day} className="flex flex-col items-center">
              <motion.button
                onClick={() =>
                  !isPast && !isInvalid && handleDateClick(day, price)
                }
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
              {!checkIn && !isPast && !isInvalid && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ${price}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Showing prices in USD (US Dollars)
      </p>

      {/* Selected Info */}
      <div className="mt-6 grid grid-cols-2 gap-6 text-center">
        <div
          className={`p-4 rounded-lg shadow-md transition ${
            themeName === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-blue-50 text-gray-700"
          }`}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            Check-in
          </h3>
          <p className="mt-2 text-lg font-bold">
            {checkIn ? checkIn : "Not Selected"}
          </p>
          {checkInPrice && (
            <p className="mt-1 text-sm text-gray-500">Price: ${checkInPrice}</p>
          )}
        </div>
        <div
          className={`p-4 rounded-lg shadow-md transition ${
            themeName === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-green-50 text-gray-700"
          }`}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            Check-out
          </h3>
          <p className="mt-2 text-lg font-bold">
            {checkOut ? checkOut : "Not Selected"}
          </p>
        </div>
      </div>

      {/* Reset Buttons */}
      {(checkIn || checkOut) && (
        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={() => {
              setCheckIn(null);
              setCheckInPrice(null);
              setCheckOut(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 cursor-pointer rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition shadow-md"
          >
            Clear All
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CalendarBooking