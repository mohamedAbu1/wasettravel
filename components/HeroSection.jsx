"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  InputAdornment,
  Box,
  Button,
} from "@mui/material";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaCity,
  FaDollarSign,
  FaUmbrellaBeach,
  FaCalendarAlt,
} from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import Content from "./Content";

export default function HeroSection() {
  const { theme } = useTheme(); // theme يحتوي على خصائص من lightTheme أو darkTheme

  const images = [
    "/pexels-axp-photography-500641970-18934598.jpg",
    "/pexels-axp-photography-500641970-18934583.jpg",
    "/pexels-axp-photography-500641970-18991537.jpg",
    "/pexels-frans-van-heerden-201846-631339.jpg",
  ];

  const [index, setIndex] = useState(0);

  // Auto Slide with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // States for filter
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [tripType, setTripType] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  const handleSearch = () => {
    console.log({ city, price, tripType, arrival, departure });
  };

  return (
    <section
      className={`
        relative h-[100vh] w-full overflow-hidden
        ${theme.background} ${theme.text}
        transition-colors duration-300
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          key={index}
          src={images[index]}
          alt="WasetTravel Slide"
          fill
          priority
          className="object-cover opacity-90 transition-opacity duration-1000"
        />
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${theme.overlay}`} />

      {/* Floating Halo Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 blur-[120px] rounded-full animate-pulse" />

      {/* Social Media */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-30">
        {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className={`
              p-3 rounded-full
              ${theme.card} ${theme.shadow}
              hover:scale-125 transition-all
            `}
          >
            <Icon size={22} className={theme.icon} />
          </a>
        ))}
      </div>

      {/* Content */}
      <Content />
   

      {/* Bottom Fade */}
      <div className={`absolute bottom-0 left-0 w-full h-40 ${theme.overlay}`} />
    </section>
  );
}
