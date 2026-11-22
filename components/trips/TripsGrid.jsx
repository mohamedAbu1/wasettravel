"use client";
import { useState } from "react";
import { FaStar, FaDollarSign, FaEuroSign, FaCoins } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { resolveTripImage } from "@/lib/imageCatalog";
import { normalizeGalleryImages } from "@/lib/galleryImages";
import { toPublicImageUrl } from "@/lib/publicImageUrl";
import { getAdultTripPrice } from "@/lib/tripPricing";
import { tripCopy } from "@/lib/tripUiCopy";
import { normalizePublicCopy } from "@/lib/publicCopy";

function localizedValue(value, lang, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "object") return value[lang] || value.en || Object.values(value)[0] || fallback;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" && parsed !== null
        ? parsed[lang] || parsed.en || Object.values(parsed)[0] || fallback
        : value;
    } catch {
      return value;
    }
  }
  return String(value);
}

export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const { userData } = useAuth();
  const { currency, purchases } = usePurchase();
  const { convertPrice } = useCurrency();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const [expandedTripId, setExpandedTripId] = useState(null);

  return (
    <div
      className={`flex-1 z-[0] ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
      } `}
    >
      {trips.map((trip, i) => {
        const fallbackImage = resolveTripImage({
          title: normalizePublicCopy(localizedValue(trip.title, lang)),
          cities: trip.cities?.map((city) => localizedValue(city?.name, lang)),
          categories: trip.categories?.map((category) => localizedValue(category?.name, lang)),
        });
        const avgStars = Math.max(0, Math.min(5, Number(trip.rating) || 0));
        const tripCurrency = String(trip.currency || "USD").toUpperCase();
        const displayCurrency = String(currency || tripCurrency).toUpperCase();
        const displayedPrice = convertPrice(getAdultTripPrice(trip), tripCurrency, displayCurrency);
        const galleryImages = normalizeGalleryImages(trip.gallery_images);
        const coverImage = typeof trip.cover_image === "string" && trip.cover_image
          ? toPublicImageUrl(trip.cover_image)
          : fallbackImage;
        const isExpanded = expandedTripId === trip.id;
        const displayTitle = normalizePublicCopy(localizedValue(trip.title, lang, "Untitled"));

        const hasPurchased =
          userData &&
          purchases.some(
            (p) =>
              p.user_id?.toString() === userData.id?.toString() &&
              p.trip_id?.toString() === trip.id?.toString() &&
              p.status !== "Cancelled",
          );

        // 🟢 اختيار الأيقونة حسب العملة
        let CurrencyIcon = FaDollarSign;
        let currencyColor;
        if (displayCurrency === "USD") {
          CurrencyIcon = FaDollarSign;
          currencyColor = theme.usdColor || "#2ecc71";
        } else if (displayCurrency === "EUR") {
          CurrencyIcon = FaEuroSign;
          currencyColor = theme.eurColor || "#3498db";
        } else if (displayCurrency === "EGP") {
          CurrencyIcon = FaCoins;
          currencyColor = theme.egpColor || "#b8860b";
        }

        return (
          <motion.div
            key={trip.id || i}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.02,
              boxShadow: theme.shadow,
            }}
            onMouseEnter={() => setExpandedTripId(trip.id)}
            onMouseLeave={() => setExpandedTripId(null)}
            onFocus={() => setExpandedTripId(trip.id)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setExpandedTripId(null);
            }}
            className={`trips-card ${isExpanded ? "trips-card--expanded" : ""} flex min-w-0 ${
              cardStyle === "vertical" ? "w-full flex-col" : "w-full flex-col md:flex-row"
            } stone-card rounded-xl shadow-lg overflow-hidden`}
          >
            {/* Show only the cover by default. Mount the slider on hover/focus. */}
            <div
              className={`trips-card__media ${
                cardStyle === "vertical" ? "w-full" : "w-full md:w-1/2"
              } relative min-w-0`}
            >
              {isExpanded && galleryImages.length > 1 ? (
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  loop
                  autoplay={{ delay: 3000 }}
                  pagination={{ clickable: true }}
                  navigation
                  modules={[Autoplay, Pagination, Navigation]}
                  className="trips-card__slider h-[300px] bg-[#ead9c7] lg:h-[480px]"
                >
                  {galleryImages.map((image, idx) => (
                    <SwiperSlide key={`${image.url}-${idx}`}>
                      <Image
                        src={image.url}
                        alt={`Trip image: ${displayTitle}`}
                        fill
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 720px"
                        priority={idx === 0}
                        loading={idx === 0 ? "eager" : "lazy"}
                        className="object-cover w-full h-full rounded-lg"
                        placeholder="blur"
                        blurDataURL={fallbackImage}
                        onError={(event) => { event.currentTarget.src = fallbackImage; }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="trips-card__cover relative h-[300px] bg-[#ead9c7] lg:h-[480px]">
                  <Image
                    src={coverImage}
                    alt={`Trip image: ${displayTitle}`}
                    fill
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                    priority={i < 3}
                    loading={i < 3 ? "eager" : "lazy"}
                    className="object-cover w-full h-full rounded-lg"
                    placeholder="blur"
                    blurDataURL={fallbackImage}
                    onError={(event) => { event.currentTarget.src = fallbackImage; }}
                  />
                  {galleryImages.length > 1 ? <button type="button" className="trips-card__gallery-hint" aria-expanded={isExpanded} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setExpandedTripId(isExpanded ? null : trip.id); }}>{tripCopy(lang, "viewPhotos", galleryImages.length)}</button> : null}
                </div>
              )}
            </div>

            {/* قسم المعلومات */}
            <div
              className={`${
                cardStyle === "vertical" ? "w-full" : "w-full md:w-1/2"
              } min-w-0 p-6 flex flex-col gap-4`}
            >
              <div className="flex items-start justify-between gap-3">
              <h3
                role="heading"
                aria-level={3}
                aria-label={displayTitle}
                className="text-1xl font-bold text-[var(--color)]"
              >
                {displayTitle}
              </h3>
              {trip.duration ? (() => {
                const duration = Number(trip.duration);
                const unit = String(trip.duration_unit || "days").toLowerCase();
                const unitKey = unit === "hours" ? (duration === 1 ? "hour" : "hours")
                  : unit === "weeks" ? (duration === 1 ? "week" : "weeks")
                    : unit === "months" ? (duration === 1 ? "month" : "months")
                      : duration === 1 ? "day" : "days";
                return <span className="trips-card__duration">{duration} {tripCopy(lang, unitKey)}</span>;
              })() : null}
              </div>

              <p
                aria-label="Trip cities"
                className="text-[var(--muted)] text-sm"
              >
                {Array.isArray(trip.cities) && trip.cities.length > 0
                  ? trip.cities
                      .filter(Boolean)
                      .map(
                        (c) =>
                          normalizePublicCopy(localizedValue(c?.name, lang, "Unknown City")),
                      )
                      .join(", ")
                  : tripCopy(lang, "unknownCity")}
              </p>

              <p
                aria-label="Trip categories"
                className="text-[var(--muted)] text-sm"
              >
                {Array.isArray(trip.categories) && trip.categories.length > 0
                  ? trip.categories
                      .filter(Boolean)
                      .map(
                        (cat) =>
                          localizedValue(cat?.name, lang, "Unknown Category"),
                      )
                      .join(", ")
                  : tripCopy(lang, "noCategory")}
              </p>

              <p
                aria-label={`Trip price in ${displayCurrency}`}
                className="text-lg font-semibold flex items-center gap-2"
              >
                <CurrencyIcon style={{ color: currencyColor }} />
                {displayedPrice} {displayCurrency}
              </p>

              <div
                className="flex items-center gap-2"
                aria-label={tripCopy(lang, "averageRating", avgStars)}
              >
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={
                      idx < avgStars ? "text-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-[var(--muted)]">({trip.review_count ?? 0} {t("reviews")})</span>
              </div>

              <Link
                href={`/${lang}/trips/${trip.id}`}
                aria-label={
                  hasPurchased ? "View trip details" : "Book this trip"
                }
                className="mt-3 px-5 py-2 rounded-lg font-bold transition cursor-pointer 
                  bg-[#C2A878] text-white hover:bg-[#a58a60] shadow-md"
              >
                {hasPurchased ? t("Tripdetails") : t("btn")}
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
