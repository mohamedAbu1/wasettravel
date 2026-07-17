"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useTrip } from "@/context/TripContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const TopTripsSection = () => {
  const { themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const router = useRouter();
  const { user } = useAuth();
  const normalizedLang = i18n.language.split("-")[0];

  const { trips, fetchTrips, loadingTrips } = useTrip();
  const { currency, purchases } = usePurchase();

  useEffect(() => {
    fetchTrips(); // ✅ يجلب الرحلات من MySQL عبر /api/trips
  }, []);

  if (loadingTrips) {
    return <p className="text-center text-gray-500">Loading top trips...</p>;
  }

  const topTrips = [...trips]
    .sort(
      (a, b) =>
        (Array.isArray(b.reviews) ? b.reviews.length : 0) -
        (Array.isArray(a.reviews) ? a.reviews.length : 0),
    )
    .slice(0, 6);

  const convertPrice = (group_price, tripCurrency) => {
    let converted = group_price;
    if (currency === "EUR" && tripCurrency === "USD") {
      converted = (group_price * 0.85).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EUR") {
      converted = (group_price * 1.18).toFixed(2);
    } else if (currency === "EGP" && tripCurrency === "USD") {
      converted = (group_price * 49.1).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EGP") {
      converted = (group_price / 49.1).toFixed(2);
    }
    return converted;
  };

  return (
    <section
      className={`hidden lg:flex w-full flex-col relative py-24 px-6 transition-colors duration-500 ${
        themeName === "dark"
          ? "bg-[#0f0f0f] text-white"
          : "bg-[#fdf6e3] text-[#3a2c0a]"
      }`}
    >
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2
          className={`text-5xl font-extrabold tracking-wide drop-shadow-md ${
            themeName === "dark"
              ? "text-gold"
              : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
          }`}
        >
          {t("TopTrips")}
        </h2>
        <DividerWithIcon />
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl w-full mx-auto">
        {topTrips.map((trip, i) => {
          const hasPurchased =
            user &&
            purchases.some(
              (p) =>
                p.user_id?.toString() === user.id?.toString() &&
                p.trip_id?.toString() === trip.id?.toString() &&
                p.status !== "Cancelled",
            );

          return (
            <motion.div
              key={trip.id || i}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex-1 basis-full sm:basis-[48%] lg:basis-[30%] xl:basis-[22%] relative rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1"
            >
              <div className="relative h-72">
                <Image
                  src={trip.cover_image || "/default.jpg"}
                  alt={trip.title?.[normalizedLang] || "Trip image"}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700 rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-gold/20 transition duration-500"></div>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold tracking-wide mb-1 text-white">
                  {trip.title?.[normalizedLang] || "Untitled Trip"}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-lg font-semibold">
                    ⭐ {trip.rating || "4.5"}
                  </span>
                  <span className="text-sm opacity-80 text-white">
                    ({Array.isArray(trip.reviews) ? trip.reviews.length : 0}{" "}
                    {t("reviews")})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className={`text-lg font-semibold ${
                      themeName === "dark" ? "text-gold" : "text-[#c9a34a]"
                    }`}
                  >
                    {convertPrice(trip.group_price, trip.currency)} {currency}
                  </p>
                  <button
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className={`px-5 py-2 rounded-lg font-medium transition text-white ${
                      hasPurchased
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-[#c9a34a] hover:bg-yellow-500"
                    }`}
                  >
                    {hasPurchased ? t("Tripdetails") : t("BookNow")}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TopTripsSection;
