"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

export default function TripHeader({ trip, lang }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = useMemo(() => {
    const gallery = Array.isArray(trip?.gallery_images) ? trip.gallery_images : [];
    if (gallery.length) return gallery;
    return trip?.cover_image ? [{ url: trip.cover_image }] : [];
  }, [trip?.gallery_images, trip?.cover_image]);
  const title = trip?.title?.[lang] || trip?.title?.en || "Egypt tour";
  const description = trip?.description?.[lang] || trip?.description?.en || "Discover an unforgettable Egypt travel experience.";

  useEffect(() => {
    setActiveIndex(0);
    if (images.length < 2) return;
    const timer = setInterval(() => setActiveIndex((current) => (current + 1) % images.length), 5500);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) return <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">No photos are available for this trip.</div>;

  const activeImage = images[activeIndex];
  const imageSrc = typeof activeImage === "string" ? activeImage : activeImage?.url || "/default.jpg";
  const imageName = typeof activeImage === "object" ? activeImage?.name?.[lang] || activeImage?.name?.en : "";

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="overflow-hidden rounded-[1.75rem] border border-[#e0b873]/25 bg-[#25211d] shadow-[0_2rem_4rem_rgba(0,0,0,.2)]">
      <div className="relative aspect-[16/8] min-h-[19rem] overflow-hidden sm:min-h-[25rem] lg:min-h-[31rem]">
        <motion.div key={activeIndex} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7 }} className="absolute inset-0"><Image src={imageSrc} alt={imageName || title} fill priority={activeIndex === 0} sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" /></motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#151311] via-[#151311]/20 to-transparent" />
        <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-white/80 backdrop-blur-md">Waset experience</div>
        {images.length > 1 && <div className="absolute right-5 top-5 flex gap-2"><button type="button" aria-label="Previous image" onClick={() => setActiveIndex((current) => (current - 1 + images.length) % images.length)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition hover:bg-[#e0b873] hover:text-[#211a13]"><FaChevronLeft /></button><button type="button" aria-label="Next image" onClick={() => setActiveIndex((current) => (current + 1) % images.length)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition hover:bg-[#e0b873] hover:text-[#211a13]"><FaChevronRight /></button></div>}
        <div className="absolute inset-x-5 bottom-6 max-w-3xl"><p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[#e0b873]">Curated Egypt journey</p><h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">{title}</h1><p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">{description}</p><div className="mt-4 flex items-center gap-2 text-sm text-[#f0c979]"><FaStar /><strong>{trip.rating || "4.5"}</strong><span className="text-white/55">({trip.review_count ?? trip.reviews?.length ?? 0} reviews)</span></div></div>
      </div>
      {images.length > 1 && <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-[#211e1b] p-3">{images.map((image, index) => { const src = typeof image === "string" ? image : image?.url || "/default.jpg"; return <button key={`${src}-${index}`} type="button" aria-label={`View image ${index + 1}`} onClick={() => setActiveIndex(index)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${index === activeIndex ? "border-[#e0b873]" : "border-transparent opacity-55 hover:opacity-100"}`}><Image src={src} alt="" fill sizes="96px" className="object-cover" /></button>; })}</div>}
    </motion.section>
  );
}
