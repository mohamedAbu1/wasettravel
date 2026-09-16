"use client";
import React, { useState, useEffect } from "react";
import TripsFilter from "@/components/trips/TripsFilter";
import TripsSearch from "@/components/trips/TripsSearch";
import TripsGrid from "@/components/trips/TripsGrid";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import { motion } from "framer-motion";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useQueryFilters } from "@/context/QueryContext";
import CurrencySelector from "../../../components/layout/CurrencySelector";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { FaSlidersH, FaCompass } from "react-icons/fa";

function localizedValue(value, lang) {
  if (!value) return "";
  if (typeof value === "object") return value[lang] || value.en || Object.values(value)[0] || "";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" ? parsed[lang] || parsed.en || Object.values(parsed)[0] || "" : value;
    } catch {
      return value;
    }
  }
  return String(value);
}

export default function TripsPage() {
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const {
    cities: allCities,
    categories: allCategories,
    loading,
  } = useCitiesCategories();
  const { lang } = useLanguage();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase(); // ✅ استدعاء الدالة
  const { t } = useTranslation("trips");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardStyle, setCardStyle] = useState("vertical");
  const tripsPerPage = cardStyle === "vertical" ? 6 : 8;
  const [search, setSearch] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { city, category, group_price, popular } = useQueryFilters();

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, city, category, group_price, popular, cardStyle]);

  if (loadingTrips)
    return <p className="min-h-[40vh] pt-32 text-center text-[var(--muted)]">Loading trips...</p>;
  // فلترة الرحلات
  const filteredTrips = trips.filter((trip) => {
    const lowerSearch = search.trim().toLowerCase();

    const searchableText = [
      localizedValue(trip.title, lang),
      ...(trip.cities || []).map((item) => localizedValue(item?.name, lang)),
      ...(trip.categories || []).map((item) => localizedValue(item?.name, lang)),
    ].join(" ").toLowerCase();
    const matchesSearch = !lowerSearch || searchableText.includes(lowerSearch);

    const tripCities =
      trip.cities
        ?.map((c) => {
          return localizedValue(c?.name, lang);
        })
        .filter((n) => n !== "") || [];

    const matchesCity =
      !city || city === "all"
        ? true
        : Array.isArray(city)
          ? tripCities.some((c) =>
              city.some((x) => c.toLowerCase() === x.toLowerCase()),
            )
          : tripCities.some((c) => c.toLowerCase() === city.toLowerCase());

    const tripCategories =
      trip.categories
        ?.map((cat) => {
            return localizedValue(cat?.name, lang);
        })
        .filter((n) => n !== "") || [];

    const matchesCategory =
      !category || category === "all"
        ? true
        : Array.isArray(category)
          ? tripCategories.some((c) =>
              category.some((x) => c.toLowerCase() === x.toLowerCase()),
            )
          : tripCategories.some(
              (c) => c.toLowerCase() === category.toLowerCase(),
            );

    const ranges = {
      Economy: { min: 0, max: 199 },
      Standard: { min: 200, max: 599 },
      Luxury: { min: 600, max: Infinity },
    };
    const selectedRange = ranges[group_price];

    const matchesPrice =
      group_price === "All" || !group_price
        ? true
        : selectedRange
          ? trip.group_price >= selectedRange.min &&
            trip.group_price <= selectedRange.max
          : true;

    return matchesSearch && matchesCity && matchesCategory && matchesPrice;
  });

  // ✅ لو popular مفعّل → اربط المشتريات بالرحلات بدون تكرار
  // نفترض إن عندك purchases = [ { trip_id: "...", ... }, { trip_id: "...", ... } ]

  let finalTrips;
  if (popular) {
    // نجمع عدد المشتريات لكل trip_id
    const purchaseMap = new Map();
    purchases.forEach((p) => {
      const currentCount = purchaseMap.get(p.trip_id) || 0;
      purchaseMap.set(p.trip_id, currentCount + 1);
    });

    // نربط الرحلات بالمشتريات مرة واحدة فقط
    finalTrips = filteredTrips.map((trip) => {
      const count = purchaseMap.get(trip.id) || 0;
      return { ...trip, purchase_count: count };
    });
  } else {
    finalTrips = filteredTrips;
  }

  // تقسيم الصفحات
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = finalTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(finalTrips.length / tripsPerPage);

  return (
    <>
      <main className="relative flex flex-col min-h-screen justify-center items-center mt-7">
        <EgyptianBackground />
        <Header />

 
          <motion.section
            style={{ marginTop: "105px", paddingBottom: "20px" }}
            className="trips-page-shell relative z-10 flex flex-1 flex-col gap-5 px-4 sm:px-6"
          >
            <div className="flex items-end justify-between gap-4 lg:hidden">
              <div>
                <p className="stone-kicker">WasetTravel collection</p>
                <h1 className="mt-1 text-2xl font-bold text-[var(--foreground)]">{t("ExploreTrips", { defaultValue: "Explore journeys" })}</h1>
              </div>
              <button type="button" className="trips-filter-trigger" onClick={() => setMobileFilterOpen(true)}>
                <FaSlidersH /> {t("Filters", { defaultValue: "Filters" })}
              </button>
            </div>
            <div className="flex items-start gap-6">
            <div className="hidden w-[280px] shrink-0 lg:block">
              <TripsFilter
                allCities={allCities}
                allCategories={allCategories}
                loading={loading}
              />
            </div>

            <TripsFilter allCities={allCities} allCategories={allCategories} loading={loading} mobileOpen={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} />

            <div className="flex-1 flex flex-col gap-6">
              <TripsSearch
                search={search}
                setSearch={setSearch}
                cardStyle={cardStyle}
                setCardStyle={setCardStyle}
              />
              <div className="flex items-center justify-between gap-3 text-sm text-[var(--muted)]" aria-live="polite">
                <span className="inline-flex items-center gap-2"><FaCompass className="text-[var(--color)]" /> {finalTrips.length} {t("TripsFound", { defaultValue: "journeys found" })}</span>
                {search ? <span className="max-w-[55%] truncate">“{search}”</span> : null}
              </div>
              {currentTrips.length ? (
                <TripsGrid trips={currentTrips} cardStyle={cardStyle} />
              ) : (
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-6 py-16 text-center text-[var(--muted)] shadow-sm" role="status">
                  {t("NoTrips", { defaultValue: "No trips match your current filters yet." })}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 30, behavior: "smooth" });
                      }}
                      className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition ${
                        currentPage === i + 1
                          ? "bg-[var(--primary-color)] text-gray-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          </motion.section>

        <Footer />
        <SignUpButton />
        <LoginModal />
        {userData && <ChatWidget />}
        {userData && <AdminDashboardButton />}
        {chatUser && (
          <AdminChatWindow
            user={chatUser}
            admin={userData}
            messages={[]}
            onClose={() => setChatUser(null)}
          />
        )}
        <CurrencySelector />
      </main>
    </>
  );
}
