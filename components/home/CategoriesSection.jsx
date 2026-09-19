"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { resolveCategoryImage } from "@/lib/imageCatalog";

const imageUrl = (url, name) => {
  if (!url || typeof url !== "string" || !url.trim()) return resolveCategoryImage(name);
  return url.startsWith("http") ? `${url}?width=800&quality=75&format=webp` : (url.startsWith("/") ? url : `/${url}`);
};

function CategoryCard({ category, language, position }) {
  const { lang } = useLanguage();
  const [imageIndex, setImageIndex] = useState(0);
  const name = typeof category.name === "object" ? category.name?.[language] || category.name?.en || Object.values(category.name)[0] : category.name;
  const images = category.images?.length ? category.images : [resolveCategoryImage(name)];

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => setImageIndex((current) => (current + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const explore = () => {
    return `/${lang}/trips?category=${encodeURIComponent(name)}`;
  };

  return (
    <Link href={explore()} aria-label={`View trips in category ${name}`} className="stone-card group relative block min-h-[15rem] overflow-hidden rounded-[1.25rem] outline-none focus-visible:ring-2 focus-visible:ring-[#e0b873] sm:min-h-[17rem]">
      <Image src={imageUrl(images[imageIndex], name)} alt={name} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 260px" className="object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/35 to-transparent" />
      <div className="absolute left-4 top-4 flex items-center gap-2"><span className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] text-white/80 backdrop-blur-md">{String(position + 1).padStart(2, "0")}</span>{images.length > 1 && <span className="h-1.5 w-1.5 rounded-full bg-[#e0b873]" />}</div>
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3"><h3 className="text-xl font-bold leading-tight text-white drop-shadow-lg">{name}</h3><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#e0b873]/60 bg-[#e0b873]/15 text-lg text-[#f0c979] transition group-hover:bg-[#e0b873] group-hover:text-[#211a13]">↗</span></div>
    </Link>
  );
}

const CategoriesSection = () => {
  const { themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { categories = [], loading } = useCitiesCategories();
  const language = i18n.language.split("-")[0];

  if (loading) return <section className="stone-section flex min-h-80 items-center justify-center"><p className="text-white/60">Loading categories...</p></section>;
  if (!categories.length) return <section className="stone-section flex min-h-80 items-center justify-center"><p className="text-white/60">No categories available right now.</p></section>;

  return (
    <section className={`stone-section w-full px-5 sm:px-8 ${themeName === "light" ? "text-[#30271d]" : "text-white"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="stone-kicker mb-3">Find your way</p><h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("ExploreCategories")}</h2><DividerWithIcon /></div><p className="max-w-md text-sm leading-6 text-white/55 md:text-right">{t("Discover")}</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{categories.map((category, position) => <CategoryCard key={category.id || position} category={category} language={language} position={position} />)}</div>
      </div>
    </section>
  );
};

export default CategoriesSection;
