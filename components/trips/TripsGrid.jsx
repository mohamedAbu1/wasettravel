"use client";
import { FaStar, FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const router = useRouter();
  const { userData } = useAuth();
  const { currency, purchases } = usePurchase();
  const { convertPrice } = useCurrency();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const { theme } = useTheme();

  return (
    <div
      className={`flex-1 z-[0] ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
      } `}
    >
      {trips.map((trip, i) => {
        const avgStars = Math.max(0, Math.min(5, Number(trip.rating) || 4));
        const displayedPrice = convertPrice(trip.group_price || 0, trip.currency || "USD", currency);

        const hasPurchased =
          userData &&
          purchases.some(
            (p) =>
              p.user_id?.toString() === userData.id?.toString() &&
              p.trip_id?.toString() === trip.id?.toString() &&
              p.status !== "Cancelled",
          );

        // 🟢 اختيار الأيقونة حسب العملة
        let CurrencyIcon;
        let currencyColor;
        if (currency === "USD") {
          CurrencyIcon = FaDollarSign;
          currencyColor = theme.usdColor || "#2ecc71";
        } else if (currency === "EUR") {
          CurrencyIcon = FaEuroSign;
          currencyColor = theme.eurColor || "#3498db";
        } else if (currency === "EGP") {
          CurrencyIcon = FaPoundSign;
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
            className={`trips-card flex ${
              cardStyle === "vertical" ? "w-full flex-col" : "flex-row"
            } stone-card rounded-xl shadow-lg overflow-hidden`}
          >
            {/* قسم الصور بسليدر */}
            <div
              className={` ${
                cardStyle === "vertical" ? "w-full" : "lg:w-1/2"
              } w-full`}
            >
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                navigation
                modules={[Autoplay, Pagination, Navigation]}
                className="h-[300px] bg-[#ead9c7] lg:h-[480px]"
              >
                {(Array.isArray(trip.images) && trip.images.length ? trip.images : [trip.cover_image]).map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Image
                      src={img || "/HomePageImage/_16934_1.webp"}
                      alt={`Trip image: ${trip.title?.[lang] || trip.title?.en || "Untitled"}`}
                      fill
                      quality={75} // ✅ ضغط الصورة بدون فقدان واضح للجودة
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" // ✅ صور متجاوبة
                      priority={i === 0} // ✅ تحميل الصورة الأولى بسرعة لتحسين LCP
                      loading={i === 0 ? "eager" : "lazy"} // ✅ تحميل كسول لباقي الصور
                      className="object-cover w-full h-full rounded-lg"
                      style={{ aspectRatio: "4/3" }} // ✅ يمنع تغير الأبعاد أثناء التحميل (يقلل CLS)
                      placeholder="blur" // ✅ تحسين تجربة التحميل
                      blurDataURL="/HomePageImage/_16934_1.webp" // ✅ صورة منخفضة الجودة أثناء التحميل
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* قسم المعلومات */}
            <div
              className={`${
                cardStyle === "vertical" ? "w-full" : "lg:w-1/2"
              } w-full p-6 flex flex-col gap-4`}
            >
              <div className="flex items-start justify-between gap-3">
              <h3
                role="heading"
                aria-level={3}
                aria-label={trip.title?.[lang] || trip.title?.en || "Untitled"}
                className="text-1xl font-bold text-[var(--color)]"
              >
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h3>
              {trip.duration ? <span className="trips-card__duration">{trip.duration} {trip.duration_unit || "days"}</span> : null}
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
                          c.name?.[lang] ||
                          c.name?.["en"] ||
                          Object.values(c.name)[0] ||
                          "Unknown City",
                      )
                      .join(", ")
                  : "Unknown City"}
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
                          cat.name?.[lang] ||
                          cat.name?.["en"] ||
                          Object.values(cat.name)[0] ||
                          "Unknown Category",
                      )
                      .join(", ")
                  : t("NoCategory")}
              </p>

              <p
                aria-label={`Trip price in ${currency}`}
                className="text-lg font-semibold flex items-center gap-2"
              >
                <CurrencyIcon style={{ color: currencyColor }} />
                {displayedPrice} {currency}
              </p>

              <div
                className="flex items-center gap-2"
                aria-label={`Average rating ${avgStars} out of 5`}
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

              <button
                onClick={() => router.push(`/${lang}/trips/${trip.id}`)}
                aria-label={
                  hasPurchased ? "View trip details" : "Book this trip"
                }
                className="mt-3 px-5 py-2 rounded-lg font-bold transition cursor-pointer 
                  bg-[#C2A878] text-white hover:bg-[#a58a60] shadow-md"
              >
                {hasPurchased ? t("Tripdetails") : t("btn")}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
