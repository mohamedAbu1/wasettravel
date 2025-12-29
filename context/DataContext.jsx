/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { createContext, useContext, useState } from "react";
import { addDays } from "date-fns";
import { useTheme } from "@/context/ThemeContext";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import StarIcon from "@mui/icons-material/Star";
import { Box } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers";
const DataContext = createContext();
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
export function DataProvider({ children }) {
  const { themeName, theme } = useTheme(); // theme يحتوي على خصائص من lightTheme أو darkTheme
  const [city, setCity] = useState("Luxor");
  const [price, setPrice] = useState("150");
  const [tripType, setTripType] = useState("Cultural");
  const [arrival, setArrival] = useState(addDays(new Date(), 2));
  const [departure, setDeparture] = useState(addDays(new Date(), 9));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  const handleSearch = () => {
    console.log({ city, price, tripType, arrival, departure });
  };
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const specialDatesBase = [
    {
      date: new Date(2026, 11, 25),
      type: "Holiday",
      iconType: "celebration",
      discount: 0.3,
    },
    {
      date: new Date(2026, 0, 1),
      type: "Newyear",
      iconType: "star",
      discount: 0.2,
    },
  ];
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  const specialDates = specialDatesBase.map((item) => {
    let icon;
    switch (item.iconType) {
      case "celebration":
        icon = <CelebrationIcon sx={{ color: "#e6c200", fontSize: 18 }} />;
        break;
      case "star":
        icon = <StarIcon sx={{ color: "#C9A34A", fontSize: 18 }} />;
        break;
      case "offer":
        icon = <LocalOfferIcon sx={{ color: "#B9972F", fontSize: 18 }} />;
        break;
      case "calendar":
        icon = (
          <CalendarMonthIcon
            sx={{
              color: themeName === "dark" ? "#fff" : "#C9A34A",
              fontSize: 18,
            }}
          />
        );
        break;
    }
    return { ...item, icon };
  });
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  function DayWithIcon(props) {
    const { day } = props;

    // البحث عن اليوم في المصفوفة
    const special = specialDates.find(
      (item) => item.date.toDateString() === day.toDateString()
    );

    return (
      <Box sx={{ position: "relative" }}>
        <PickersDay {...props} />
        {special && (
          <Box
            sx={{
              position: "absolute",
              right: -6,
              top: -6,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {special.icon}
          </Box>
        )}
      </Box>
    );
  }
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  return (
    <DataContext.Provider
      value={{
        city,
        setCity,
        addDays,
        price,
        setPrice,
        tripType,
        setTripType,
        arrival,
        setArrival,
        departure,
        setDeparture,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleSearch,
        specialDates,
        DayWithIcon,
        handleOpen,
        handleClose,
        open,
        setOpen,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
