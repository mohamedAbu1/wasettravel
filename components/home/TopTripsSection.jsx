"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useTrip } from "@/context/TripContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { resolveTripImage } from "@/lib/imageCatalog";

const MAX_TOP_TRIPS = 6;

const TopTripsSection = () => {
  const { themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { t: ui } = useTranslation("ui");
  const router = useRouter();
  const { userData } = useAuth();
  const { trips, fetchTrips, loadingTrips, error: tripsError } = useTrip();
  const { currency, purchases } = usePurchase();
  const { convertPrice } = useCurrency();
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const language = i18n.language.split("-")[0];

  useEffect(() => {
    let cancelled = false;
    const loadTopTrips = async () => {
      const summaryTrips = await fetchTrips("?summary=1");
      if (!cancelled && !summaryTrips?.length) await fetchTrips();
    };
    loadTopTrips();
    return () => { cancelled = true; };
  }, [fetchTrips]);
  useEffect(() => {
    if (trips.length < 2) return;
    const interval = setInterval(() => setIndex((previous) => (previous + 1) % Math.min(trips.length, MAX_TOP_TRIPS)), 5000);
    return () => clearInterval(interval);
  }, [trips.length]);

  if (loadingTrips) return <section className="stone-section flex min-h-96 items-center justify-center"><p className="text-white/60">{ui("loadingTopTrips")}</p></section>;

  const topTrips = [...trips]
    .sort((a, b) => {
      const reviewDifference = Number(b.review_count ?? b.reviews?.length ?? 0) - Number(a.review_count ?? a.reviews?.length ?? 0);
      if (reviewDifference !== 0) return reviewDifference;
      return Number(b.rating || 0) - Number(a.rating || 0);
    })
    .slice(0, MAX_TOP_TRIPS);

  if (!topTrips.length) return null;

  const TripCard = ({ trip, position }) => {
    const title = trip.title?.[language] || trip.title?.en || "Untitled Trip";
    const fallbackImage = resolveTripImage({
      title,
      cities: trip.cities?.map((city) => city?.name?.[language] || city?.name?.en || city?.name),
      categories: trip.categories?.map((category) => category?.name?.[language] || category?.name?.en || category?.name),
    });
    const hasPurchased = userData && purchases.some((purchase) => purchase.user_id?.toString() === userData.id?.toString() && purchase.trip_id?.toString() === trip.id?.toString() && purchase.status !== "Cancelled");
    return (
      <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: position * 0.08 }} viewport={{ once: true, amount: 0.2 }} className="stone-card group relative min-w-0 overflow-hidden rounded-[1.35rem]">
        <div className="relative aspect-[1.15] overflow-hidden">
          <Image src={trip.cover_image || fallbackImage} alt={title} fill sizes="(max-width: 768px) 92vw, (max-width: 1280px) 31vw, 360px" className="object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151311] via-[#151311]/15 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">{String(position + 1).padStart(2, "0")}</span>
          <div className="absolute inset-x-5 bottom-4"><p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#e0b873]">Waset experience</p><h3 className="line-clamp-2 text-xl font-bold leading-tight text-white">{title}</h3></div>
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div><div className="flex items-center gap-1.5 text-sm text-[#e0b873]"><span>★</span><span className="font-bold">{trip.rating || "4.5"}</span><span className="text-white/45">({trip.review_count ?? trip.reviews?.length ?? 0} {t("reviews")})</span></div><p className="mt-1 text-lg font-bold text-[#f3d18f]">{convertPrice(trip.group_price, trip.currency || "USD", currency)}</p></div>
          <button onClick={() => router.push(`/${lang}/trips/${trip.id}`)} className={`rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${hasPurchased ? "bg-[#83b995] text-[#13251a]" : "stone-button"}`}>{hasPurchased ? t("Tripdetails") : t("BookNow")}</button>
        </div>
      </motion.article>
    );
  };

  return (
    <section className={`stone-section w-full px-5 sm:px-8 ${themeName === "light" ? "text-[#30271d]" : "text-white"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"><div><p className="stone-kicker mb-3">Curated journeys</p><h2 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">{t("TopTrips")}</h2><DividerWithIcon /></div><div className="hidden max-w-xs text-right text-sm leading-6 text-white/55 sm:block">Handpicked experiences designed to make every moment in Egypt feel effortless.</div></div>
        {topTrips.length ? <><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{topTrips.map((trip, position) => <TripCard key={`${trip.id}-${position}`} trip={trip} position={position} />)}</div><div className="mt-6 flex justify-center gap-2 lg:hidden" aria-label="Trip carousel position">{topTrips.map((trip, position) => <span key={trip.id} className={`h-1.5 rounded-full transition-all ${position === index % topTrips.length ? "w-8 bg-[#e0b873]" : "w-1.5 bg-white/25"}`} />)}</div></> : null}
      </div>
    </section>
  );
};

export default TopTripsSection;
