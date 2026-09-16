"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCarSide, FaCheck, FaWhatsapp } from "react-icons/fa";
import DividerWithIcon from "../layout/DividerWithIcon";
import { openWhatsAppBooking } from "@/lib/whatsappBooking";

const CarBookingSection = () => {
  const { themeName } = useTheme();
  const { t } = useTranslation("home");
  const benefits = ["Professional driver", "Comfortable premium vehicle", "On-time airport pickup"];

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="stone-section w-full px-5 sm:px-8">
      <div className={`car-booking-card relative mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border shadow-[0_2rem_5rem_rgba(78,54,31,.14)] lg:min-h-[28rem] lg:flex-row ${themeName === "dark" ? "border-[#e0b873]/25 bg-[#27231f]" : "border-[#8f5d2e]/20 bg-[#fffaf3]"}`}>
        <div className={`absolute inset-0 ${themeName === "dark" ? "bg-[radial-gradient(circle_at_15%_20%,rgba(224,184,115,.16),transparent_32%),linear-gradient(115deg,#302920,#1b1917)]" : "bg-[radial-gradient(circle_at_15%_20%,rgba(143,93,46,.10),transparent_35%),linear-gradient(115deg,#fffaf3,#eadbca)]"}`} />
        <div className="relative order-2 flex w-full items-end justify-center px-5 pb-6 pt-2 sm:px-12 lg:order-1 lg:w-1/2 lg:pb-0"><Image src="/HomePageImage/car-png-39057.png" alt="Luxury car transfer" width={760} height={460} className="w-full max-w-[42rem] object-contain drop-shadow-[0_1.5rem_2rem_rgba(0,0,0,.5)]" /></div>
        <div className="relative order-1 flex w-full flex-col justify-center px-6 py-10 sm:px-12 lg:order-2 lg:w-1/2 lg:py-14">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e0b873]/35 bg-[#e0b873]/10 text-xl text-[#e0b873]"><FaCarSide /></div>
          <p className="stone-kicker mb-3">Arrive in comfort</p>
          <h2 className={`max-w-lg text-3xl font-bold leading-tight sm:text-5xl ${themeName === "dark" ? "text-[#f6eddf]" : "text-[#30271d]"}`}>{t("PremiumCarTransfer")}</h2>
          <DividerWithIcon />
          <p className={`mt-5 max-w-xl text-base leading-7 ${themeName === "dark" ? "text-white/65" : "text-[#5f4c3a]"}`}>{t("Experience")}</p>
          <ul className={`mt-5 grid gap-2 text-sm sm:grid-cols-3 lg:grid-cols-1 ${themeName === "dark" ? "text-white/75" : "text-[#4f3d2d]"}`}>{benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2"><FaCheck className="text-[#8f5d2e]" />{benefit}</li>)}</ul>
          <motion.button whileHover={{ y: -2 }} onClick={() => openWhatsAppBooking("🚗 Car transfer request\n\nFrom: \nTo: \nDate and time: \nPassengers: \n\nPlease confirm availability and the final price.")} className="stone-button mt-8 inline-flex w-fit items-center gap-2 rounded-full px-7 py-3.5 font-bold"><FaWhatsapp /> Book via WhatsApp</motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default CarBookingSection;
