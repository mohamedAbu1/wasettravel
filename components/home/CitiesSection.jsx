"use client";

import Image from "next/image";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { resolveCityImage } from "@/lib/imageCatalog";

const imageUrl = (url, name) => {
  if (!url || typeof url !== "string" || !url.trim()) return resolveCityImage(name);
  return url.startsWith("http") ? `${url}?width=1000&quality=75&format=webp` : (url.startsWith("/") ? url : `/${url}`);
};

function CityCard({ city, language, position, t }) {
  const name = typeof city.name === "object" ? city.name?.[language] || city.name?.en || Object.values(city.name)[0] : city.name;
  const { lang } = useLanguage();
  const href = `/${lang}/trips?city=${encodeURIComponent(name)}`;

  return (
    <Link href={href} aria-label={`Explore trips in ${name}`} className={`group relative block min-h-[19rem] overflow-hidden rounded-[1.35rem] border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[#e0b873] ${position === 0 ? "sm:col-span-2 sm:min-h-[24rem]" : ""}`}>
      <Image src={imageUrl(city.images?.[0], name)} alt={`City view of ${name}`} fill sizes={position === 0 ? "(max-width: 640px) 92vw, 66vw" : "(max-width: 640px) 92vw, 33vw"} className="object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#11100e] via-[#11100e]/15 to-transparent" />
      <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-md">0{position + 1}</div>
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e0b873]">Destination</p><h3 className={`${position === 0 ? "text-3xl" : "text-2xl"} font-bold leading-tight text-white`}>{name}</h3></div><span className="rounded-full bg-[#e0b873] px-4 py-2 text-xs font-bold text-[#211a13] opacity-100 transition hover:bg-[#f0c979] sm:opacity-0 sm:group-hover:opacity-100">{t("Explore")}</span></div>
    </Link>
  );
}

const CitiesSection = () => {
  const { themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { cities = [], loading } = useCitiesCategories();
  const language = i18n.language.split("-")[0];

  if (loading) return <section className="stone-section flex min-h-80 items-center justify-center"><p className="text-white/60">Loading cities...</p></section>;
  if (!cities.length) return <section className="stone-section flex min-h-80 items-center justify-center"><p className="text-white/60">No cities available right now.</p></section>;

  return (
    <section className={`stone-section w-full px-5 sm:px-8 ${themeName === "light" ? "text-[#30271d]" : "text-white"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"><div><p className="stone-kicker mb-3">Start somewhere memorable</p><h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("ExploreCities")}</h2><DividerWithIcon /></div><p className="max-w-sm text-sm leading-6 text-white/55 sm:text-right">From timeless temples to calm Nile horizons, choose the place that speaks to you.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cities.map((city, position) => <CityCard key={city.id || position} city={city} language={language} position={position} t={t} />)}</div>
      </div>
    </section>
  );
};

export default CitiesSection;
