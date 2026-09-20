/* eslint-disable react-hooks/purity */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaCalendarAlt, FaCheck, FaCompass, FaUsers, FaWhatsapp } from "react-icons/fa";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/layout/ChatWidget";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import CurrencySelector from "@/components/layout/CurrencySelector";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpModal from "@/components/home/components/SignUpButton";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { openWhatsAppBooking } from "@/lib/whatsappBooking";

const destinations = ["Luxor", "Aswan", "Cairo", "Abu Simbel", "Nile cruise"];
const interests = ["Ancient temples", "Nile moments", "Local food", "Desert adventure", "Family time", "Slow travel"];
const durations = ["2–3 days", "4–6 days", "7–10 days", "10+ days"];

const initialForm = {
  destinations: [],
  duration: "4–6 days",
  interests: [],
  travelers: "2",
  date: "",
  accommodation: "Boutique hotels",
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export default function TailorYourTripPage() {
  const { themeName } = useTheme();
  const { userData } = useAuth();
  const { lang } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggle = (key, value) => setForm((current) => ({
    ...current,
    [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
  }));

  const summary = useMemo(() => ({
    destinations: form.destinations.length ? form.destinations.join(", ") : "Your chosen destinations",
    interests: form.interests.length ? form.interests.join(", ") : "Your travel style",
  }), [form.destinations, form.interests]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = [
      "✦ *Tailor my trip request*",
      "",
      `*Name:* ${form.name}`,
      `*Email:* ${form.email || "Not provided"}`,
      `*WhatsApp:* ${form.phone}`,
      `*Destinations:* ${summary.destinations}`,
      `*Duration:* ${form.duration}`,
      `*Travelers:* ${form.travelers}`,
      `*Preferred date:* ${form.date || "Flexible"}`,
      `*Accommodation:* ${form.accommodation}`,
      `*Interests:* ${summary.interests}`,
      `*Notes:* ${form.notes || "No additional notes"}`,
    ].join("\n");
    setSubmitted(true);
    openWhatsAppBooking(message);
  };

  const inputClass = "w-full rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--color)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color)_14%,transparent)]";
  const selected = (key, value) => form[key].includes(value);

  return (
    <main className={`min-h-screen bg-[var(--background)] text-[var(--foreground)] ${themeName === "dark" ? "" : ""}`}>
      <Header />
      <section className="relative overflow-hidden px-5 pb-14 pt-32 sm:px-8 lg:px-12 lg:pb-20 lg:pt-40">
        <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#e0b873]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <p className="hero-eyebrow"><span className="hero-eyebrow-line" /> Your Egypt, your rhythm</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[.98] tracking-[-.06em] text-[var(--foreground)] sm:text-6xl lg:text-8xl">Tailor your trip.<br /><span className="hero-title-accent">Make it yours.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">Build a journey around the places, pace, and experiences you care about. Tell us what you imagine and our local team will shape the details with you.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]"><span className="rounded-full border border-[var(--line)] px-4 py-2">Local experts</span><span className="rounded-full border border-[var(--line)] px-4 py-2">Flexible planning</span><span className="rounded-full border border-[var(--line)] px-4 py-2">Made for you</span></div>
          </div>
          <div className="rounded-[2rem] border border-[#e0b873]/25 bg-[#2a2520] p-6 text-[#f6eddf] shadow-[0_2rem_5rem_rgba(20,15,10,.22)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#e0b873]">How it works</p>
            <div className="mt-6 grid gap-5">{["Share your travel wish list", "We refine the route with local insight", "Receive a personal plan on WhatsApp"].map((item, index) => <div className="flex gap-4" key={item}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e0b873] text-sm font-black text-[#241b12]">{index + 1}</span><div><strong className="block text-sm">{item}</strong><span className="mt-1 block text-xs leading-5 text-white/55">A simple conversation turns ideas into a clear journey.</span></div></div>)}</div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <form onSubmit={handleSubmit} className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
          <div className="grid gap-6">
            <section className="stone-card rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8">
              <div className="mb-7 flex items-start justify-between gap-4"><div><p className="stone-kicker">01 · The essentials</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Where would you like to go?</h2></div><FaCompass className="mt-1 text-xl text-[var(--color)]" /></div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{destinations.map((item) => <button type="button" key={item} onClick={() => toggle("destinations", item)} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${selected("destinations", item) ? "border-[var(--color)] bg-[color-mix(in_srgb,var(--color)_13%,transparent)] text-[var(--foreground)]" : "border-[var(--line)] bg-[var(--surface-raised)] text-[var(--muted)] hover:border-[var(--color)]"}`}><span>{item}</span>{selected("destinations", item) && <FaCheck className="text-[var(--color)]" />}</button>)}</div>
              <div className="mt-7"><label className="mb-3 block text-sm font-bold">How long would you like to travel?</label><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{durations.map((item) => <button type="button" key={item} onClick={() => update("duration", item)} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${form.duration === item ? "border-[var(--color)] bg-[var(--color)] text-[#241b12]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--color)]"}`}>{item}</button>)}</div></div>
            </section>

            <section className="stone-card rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8">
              <div className="mb-7"><p className="stone-kicker">02 · Your style</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">What should the journey feel like?</h2><p className="mt-2 text-sm text-[var(--muted)]">Choose as many as you like. There is no wrong answer.</p></div>
              <div className="flex flex-wrap gap-3">{interests.map((item) => <button type="button" key={item} onClick={() => toggle("interests", item)} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${selected("interests", item) ? "border-[var(--color)] bg-[var(--color)] text-[#241b12]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--color)]"}`}>{item}</button>)}</div>
              <div className="mt-8 grid gap-5 sm:grid-cols-3"><label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaUsers className="text-[var(--color)]" /> Travelers</span><select className={inputClass} value={form.travelers} onChange={(event) => update("travelers", event.target.value)}>{[1,2,3,4,5,6,7,8,"9+"] .map((item) => <option key={item} value={item}>{item} {item === 1 ? "traveler" : "travelers"}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold"><span className="flex items-center gap-2"><FaCalendarAlt className="text-[var(--color)]" /> Preferred date</span><input type="date" className={inputClass} value={form.date} min={new Date().toISOString().split("T")[0]} onChange={(event) => update("date", event.target.value)} /></label><label className="grid gap-2 text-sm font-semibold"><span>Stay preference</span><select className={inputClass} value={form.accommodation} onChange={(event) => update("accommodation", event.target.value)}><option>Boutique hotels</option><option>Comfort hotels</option><option>Luxury stays</option><option>Mix of stays</option></select></label></div>
            </section>

            <section className="stone-card rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8">
              <div className="mb-7"><p className="stone-kicker">03 · Make it personal</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Where can we reach you?</h2></div>
              <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold"><span>Full name *</span><input required className={inputClass} value={userData?.name || form.name} onChange={(event) => update("name", event.target.value)} readOnly={Boolean(userData?.name)} placeholder="Your name" /></label><label className="grid gap-2 text-sm font-semibold"><span>WhatsApp number *</span><input required type="tel" className={inputClass} value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+20 1xx xxx xxxx" /></label><label className="grid gap-2 text-sm font-semibold sm:col-span-2"><span>Email <span className="font-normal text-[var(--muted)]">(optional)</span></span><input type="email" className={inputClass} value={userData?.email || form.email} onChange={(event) => update("email", event.target.value)} readOnly={Boolean(userData?.email)} placeholder="you@example.com" /></label><label className="grid gap-2 text-sm font-semibold sm:col-span-2"><span>Anything else we should know?</span><textarea rows={4} className={`${inputClass} resize-y`} value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Special occasions, mobility needs, must-see places, or anything else..." /></label></div>
            </section>
          </div>

          <aside className="sticky top-28 rounded-[1.5rem] border border-[#e0b873]/25 bg-[#2a2520] p-5 text-[#f6eddf] shadow-[0_1.5rem_4rem_rgba(20,15,10,.18)] sm:p-6"><p className="text-xs font-black uppercase tracking-[.2em] text-[#e0b873]">Your trip brief</p><h2 className="mt-3 text-2xl font-bold">A journey with intention.</h2><div className="my-6 grid gap-4 border-y border-white/10 py-5 text-sm"><div><span className="block text-xs text-white/45">Destinations</span><strong className="mt-1 block leading-6">{summary.destinations}</strong></div><div><span className="block text-xs text-white/45">Pace</span><strong className="mt-1 block">{form.duration}</strong></div><div><span className="block text-xs text-white/45">Travel style</span><strong className="mt-1 block leading-6">{summary.interests}</strong></div></div><button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e0b873] px-5 py-3.5 text-sm font-black text-[#241b12] transition hover:-translate-y-0.5 hover:bg-[#f0c979]"><FaWhatsapp /> Send my trip request <FaArrowRight className="text-xs" /></button>{submitted && <p className="mt-3 text-center text-xs font-semibold text-[#9acb89]">WhatsApp is opening with your trip brief.</p>}<p className="mt-4 text-center text-xs leading-5 text-white/45">No payment or commitment. We will refine the details with you first.</p></aside>
        </form>
      </section>

      <Footer /><SignUpModal /><LoginModal />{userData && <ChatWidget />}{userData && <AdminDashboardButton />}<CurrencySelector />
    </main>
  );
}
