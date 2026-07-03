"use client";
import { FaStar, FaDollarSign, FaEuroSign } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const router = useRouter();
  const { user } = useAuth();
  const { currency, purchases } = usePurchase();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const getRandomStars = () => Math.floor(Math.random() * 3) + 3;

  // 🟢 state لتخزين سعر الصرف
  const [exchangeRate, setExchangeRate] = useState({ USD_EGP: 49.1, EUR_USD: 1.18, USD_EUR: 0.85 });

useEffect(() => {
  const fetchRate = async () => {
    try {
      const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=EGP");
      const data = await res.json();

      // تحقق إن البيانات موجودة قبل التعيين
      if (data && data.rates && data.rates.EGP) {
        setExchangeRate((prev) => ({ ...prev, USD_EGP: data.rates.EGP }));
      } else {
        console.warn("EGP rate not found in API response:", data);
      }
    } catch (err) {
      console.error("Error fetching EGP rate:", err);
    }
  };
  fetchRate();
}, []);


  // 🟢 دالة التحويل
  const convertPrice = (price, tripCurrency) => {
    let converted = price;
    if (currency === "EUR" && tripCurrency === "USD") {
      converted = (price * exchangeRate.USD_EUR).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EUR") {
      converted = (price * exchangeRate.EUR_USD).toFixed(2);
    } else if (currency === "EGP" && tripCurrency === "USD") {
      converted = (price * exchangeRate.USD_EGP).toFixed(2);
    }
    return converted;
  };

  return (
    <div
      className={`flex-1 z-[0] ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 gap-6"
      }`}
    >
      {trips.map((trip, i) => {
        const avgStars = getRandomStars();
        const displayedPrice = convertPrice(trip.group_price, "USD"); // نفترض أن السعر الأساسي بالدولار

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
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
            }}
            className={`relative rounded-xl shadow-lg overflow-hidden border border-[#c9a34a]/30 ${
              cardStyle === "vertical" ? "h-[400px]" : "h-[300px]"
            }`}
          >
            <Image
              src={trip.cover_image || "/default.jpg"}
              alt={trip.title?.[lang] || trip.title?.en || "Trip image"}
              width={660}
              height={400}
              className="object-cover w-full h-full rounded-lg"
              priority
            />

            <div className="absolute bottom-0 p-4 w-full flex flex-col gap-2 text-white bg-gradient-to-t from-black/70 to-transparent">
              <h4 className="text-lg font-bold">
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h4>
              <p className="text-sm opacity-90">
                {trip.trip_cities?.map((c) => c.cities?.name?.[lang] || c.cities?.name?.en || c.city_name).join(", ") ||
                  t("NoCity")}
              </p>
              <p className="text-sm opacity-90">
                {trip.trip_categories?.map((cat) => cat.categories?.name?.[lang] || cat.categories?.name?.en).join(", ") ||
                  t("NoCategory")}
              </p>
              <p className="text-md font-semibold flex items-center gap-2">
                <span className="px-2 py-1 rounded flex items-center gap-1 bg-[#c9a34a] text-white">
                  {currency === "USD" ? <FaDollarSign /> : currency === "EUR" ? <FaEuroSign /> : "£"}
                  {displayedPrice} {currency}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={idx < avgStars ? "text-yellow-400" : "text-gray-500 opacity-50"}
                  />
                ))}
                <span className="text-sm opacity-80">({t("reviews")})</span>
              </div>

              <button
                onClick={() => router.push(`/trips/${trip.id}`)}
                className={`mt-2 px-4 py-2 rounded-lg font-bold transition text-white ${
                  hasPurchased ? "bg-green-500 hover:bg-green-600" : "bg-[#c9a34a] hover:bg-yellow-500"
                }`}
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
