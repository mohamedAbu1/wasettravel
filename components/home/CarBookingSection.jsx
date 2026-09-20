"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaCarSide, FaCheck, FaClock, FaMapMarkerAlt, FaPhone, FaTimes, FaUser, FaUsers, FaWhatsapp } from "react-icons/fa";
import DividerWithIcon from "../layout/DividerWithIcon";
import { openWhatsAppBooking } from "@/lib/whatsappBooking";

const initialForm = {
  fullName: "",
  phone: "",
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  passengers: "1",
  vehicle: "Private car",
  notes: "",
};

const CarBookingSection = () => {
  const { themeName } = useTheme();
  const { t } = useTranslation("home");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const benefits = ["Professional driver", "Comfortable premium vehicle", "On-time airport pickup"];

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const submitBooking = (event) => {
    event.preventDefault();
    const requiredFields = [form.fullName, form.phone, form.pickup, form.dropoff, form.date, form.time];
    if (requiredFields.some((value) => !value.trim())) {
      setError("Please complete all required fields before continuing.");
      return;
    }

    const message = [
      "🚗 *New car booking request*",
      "",
      `*Guest name:* ${form.fullName.trim()}`,
      `*Phone / WhatsApp:* ${form.phone.trim()}`,
      `*Pickup:* ${form.pickup.trim()}`,
      `*Drop-off:* ${form.dropoff.trim()}`,
      `*Date:* ${form.date}`,
      `*Time:* ${form.time}`,
      `*Passengers:* ${form.passengers}`,
      `*Vehicle:* ${form.vehicle}`,
      form.notes.trim() ? `*Notes:* ${form.notes.trim()}` : "",
      "",
      "Please confirm availability, pickup instructions, and the final price.",
    ].filter(Boolean).join("\n");

    openWhatsAppBooking(message);
    setIsOpen(false);
    setForm(initialForm);
  };

  const openForm = () => {
    setError("");
    setIsOpen(true);
  };

  return (
    <>
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
          <motion.button type="button" whileHover={{ y: -2 }} onClick={openForm} className="stone-button mt-8 inline-flex w-fit items-center gap-2 rounded-full px-7 py-3.5 font-bold"><FaCarSide /> Book Your Car Now</motion.button>
        </div>
      </div>
      </motion.section>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="car-booking-dialog-title" className={`w-full max-w-3xl overflow-hidden rounded-[1.5rem] border shadow-2xl ${themeName === "dark" ? "border-[#e0b873]/25 bg-[#27231f] text-[#f6eddf]" : "border-[#8f5d2e]/20 bg-[#fffaf3] text-[#30271d]"}`}>
            <div className="flex items-start justify-between gap-4 border-b border-[#8f5d2e]/20 px-5 py-5 sm:px-7">
              <div>
                <p className="stone-kicker mb-2">WasetTravel · Private transfer</p>
                <h2 id="car-booking-dialog-title" className="text-2xl font-bold sm:text-3xl">Book your car</h2>
                <p className={`mt-2 text-sm ${themeName === "dark" ? "text-white/60" : "text-[#6b5744]"}`}>Share your journey details and continue securely on WhatsApp.</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close car booking form" className="rounded-full p-2 text-current/60 transition hover:bg-[#8f5d2e]/10 hover:text-current"><FaTimes /></button>
            </div>

            <form onSubmit={submitBooking} className="max-h-[78vh] overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaUser className="text-[#8f5d2e]" /> Full name <b className="text-[#a34e42]">*</b></span><input required name="fullName" value={form.fullName} onChange={updateField} autoComplete="name" placeholder="Your full name" className="car-booking-input" /></label>
                <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaPhone className="text-[#8f5d2e]" /> Phone / WhatsApp <b className="text-[#a34e42]">*</b></span><input required name="phone" value={form.phone} onChange={updateField} autoComplete="tel" placeholder="+20 1xx xxx xxxx" className="car-booking-input" /></label>
                <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#8f5d2e]" /> Pickup location <b className="text-[#a34e42]">*</b></span><input required name="pickup" value={form.pickup} onChange={updateField} placeholder="Airport, hotel, or address" className="car-booking-input" /></label>
                <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#8f5d2e]" /> Drop-off location <b className="text-[#a34e42]">*</b></span><input required name="dropoff" value={form.dropoff} onChange={updateField} placeholder="Hotel, airport, or address" className="car-booking-input" /></label>
                <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaCalendarAlt className="text-[#8f5d2e]" /> Date <b className="text-[#a34e42]">*</b></span><input required type="date" name="date" value={form.date} onChange={updateField} min={new Date().toISOString().split("T")[0]} className="car-booking-input" /></label>
                <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaClock className="text-[#8f5d2e]" /> Pickup time <b className="text-[#a34e42]">*</b></span><input required type="time" name="time" value={form.time} onChange={updateField} className="car-booking-input" /></label>
                <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaUsers className="text-[#8f5d2e]" /> Passengers</span><select name="passengers" value={form.passengers} onChange={updateField} className="car-booking-input"><option value="1">1 passenger</option><option value="2">2 passengers</option><option value="3">3 passengers</option><option value="4">4 passengers</option><option value="5+">5+ passengers</option></select></label>
                <label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaCarSide className="text-[#8f5d2e]" /> Vehicle type</span><select name="vehicle" value={form.vehicle} onChange={updateField} className="car-booking-input"><option>Private car</option><option>Minivan</option><option>Premium SUV</option><option>Airport transfer</option></select></label>
                <label className="grid gap-2 text-sm font-semibold sm:col-span-2"><span>Additional notes <span className="font-normal opacity-60">(optional)</span></span><textarea name="notes" value={form.notes} onChange={updateField} rows="3" placeholder="Flight number, luggage, child seat, or any special request" className="car-booking-input resize-y" /></label>
              </div>

              {error ? <p role="alert" className="mt-4 rounded-xl border border-[#a34e42]/30 bg-[#a34e42]/10 px-4 py-3 text-sm font-semibold text-[#a34e42]">{error}</p> : null}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-full border border-[#8f5d2e]/30 px-6 py-3 text-sm font-bold transition hover:bg-[#8f5d2e]/10">Cancel</button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1da851]"><FaWhatsapp /> Continue on WhatsApp</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CarBookingSection;
