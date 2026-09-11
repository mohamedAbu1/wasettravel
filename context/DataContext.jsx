/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { addDays } from "date-fns";
import { desktopImages, mobileImages } from "@/constants/images";
import { useTranslation } from "react-i18next";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const DataContext = createContext();
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
export function DataProvider({ children }) {
    const { t } = useTranslation("home");
  const [city, setCity] = useState(t("Luxor"));
  const [price, setPrice] = useState("Economy");
  const [tripType, setTripType] = useState(t("OneDayTrips"));
  const [arrival, setArrival] = useState(addDays(new Date(), 2));
  const [departure, setDeparture] = useState(addDays(new Date(), 9));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [images, setImages] = useState(desktopImages);
  const [index, setIndex] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const handleLoginOpen = () => {setLoginOpen(true) ,setSignUpOpen(false)};
  const handleSignUpOpen = () => {setSignUpOpen(true) ,setLoginOpen(false)};
  const handleLoginClose = () => setLoginOpen(false);
  const handleSignUpClose = () => setSignUpOpen(false);
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

  const specialDates = specialDatesBase;
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setImages(mobileImages);
      } else {
        setImages(desktopImages);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
        images,
        setImages,
        index,
        loginOpen,
        setLoginOpen,
        signUpOpen,
        setSignUpOpen,
        handleLoginClose,
        handleLoginOpen,
        handleSignUpOpen,
        handleSignUpClose,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
