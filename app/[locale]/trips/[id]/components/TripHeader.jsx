"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

export default function TripHeader({ trip, lang }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = useMemo(() => {
    const gallery = Array.isArray(trip?.gallery_images) ? trip.gallery_images : [];
    const normalized = gallery.map((item) => {
      if (typeof item === "string") {
        try {
          const parsed = JSON.parse(item);
          return typeof parsed === "object" ? parsed : { url: item };
        } catch {
          return { url: item };
        }
      }
      return item;
    }).map((item) => ({
      ...item,
      url: item?.url || item?.src || item?.image || item?.image_url || item?.cover_image,
    })).filter((item) => item.url);
    if (normalized.length) return normalized;
    return trip?.cover_image ? [{ url: trip.cover_image }] : [];
  }, [trip?.gallery_images, trip?.cover_image]);
  const title = trip?.title?.[lang] || trip?.title?.en || "Egypt tour";
  const description = trip?.description?.[lang] || trip?.description?.en || "Discover an unforgettable Egypt travel experience.";

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(images.length - 1, 0)));
    if (images.length < 2) return;
    const timer = setInterval(() => setActiveIndex((current) => (current + 1) % images.length), 5500);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) return <div className="trip-detail-hero rounded-3xl border p-10 text-center">No photos are available for this trip.</div>;

  const activeImage = images[activeIndex];
  const imageSrc = activeImage?.url || "/default.jpg";
  const imageName = typeof activeImage === "object" ? activeImage?.name?.[lang] || activeImage?.name?.en : "";

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="trip-detail-hero overflow-hidden rounded-[1.75rem] border shadow-[0_2rem_4rem_rgba(0,0,0,.2)]">
      <div className="trip-detail-hero__media relative aspect-[16/9] min-h-[18rem] overflow-hidden sm:min-h-[25rem] lg:min-h-[32rem]">
        <motion.div key={activeIndex} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7 }} className="absolute inset-0 grid place-items-center bg-[#171513]"><Image src={imageSrc} alt={imageName || title} fill priority={activeIndex === 0} sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" /></motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#151311] via-[#151311]/20 to-transparent" />
        <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-white/80 backdrop-blur-md">Waset experience</div>
        {images.length > 1 && <div className="absolute right-5 top-5 flex items-center gap-2"><span className="rounded-full border border-white/15 bg-black/30 px-3 py-2 text-xs font-semibold text-white/75 backdrop-blur-md">{activeIndex + 1} / {images.length}</span><button type="button" aria-label="Previous image" onClick={() => setActiveIndex((current) => (current - 1 + images.length) % images.length)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition hover:bg-[#e0b873] hover:text-[#211a13]"><FaChevronLeft /></button><button type="button" aria-label="Next image" onClick={() => setActiveIndex((current) => (current + 1) % images.length)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition hover:bg-[#e0b873] hover:text-[#211a13]"><FaChevronRight /></button></div>}
        <div className="absolute inset-x-5 bottom-6 max-w-3xl"><p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[#e0b873]">Curated Egypt journey</p><h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">{title}</h1><p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">{description}</p><div className="mt-4 flex items-center gap-2 text-sm text-[#f0c979]"><FaStar /><strong>{trip.rating || "4.5"}</strong><span className="text-white/55">({trip.review_count ?? trip.reviews?.length ?? 0} reviews)</span></div></div>
      </div>
      {images.length > 1 && <div className="trip-detail-hero__thumbs flex gap-3 overflow-x-auto border-t p-3">{images.map((image, index) => { const src = image.url; return <button key={`${src}-${index}`} type="button" aria-label={`View image ${index + 1}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)} className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:w-28 ${index === activeIndex ? "border-[#e0b873] shadow-[0_0_0_2px_rgba(224,184,115,.2)]" : "border-transparent opacity-60 hover:opacity-100"}`}><Image src={src} alt="" fill sizes="112px" className="object-cover" /></button>; })}</div>}
    </motion.section>
  );
}
