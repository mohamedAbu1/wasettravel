"use client";

import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useMessages } from "@/context/MessageContext";
import { useTranslation } from "react-i18next";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import CancelButton from "./components/CancelButton";
import TripHeader from "./components/TripHeader";
import TripCities from "./components/TripCities";
import TripCategories from "./components/TripCategories";
import TripIncludes from "./components/TripIncludes";
import TripExclusions from "./components/TripExclusions";
import TripItinerary from "./components/TripItinerary";
import TripReviews from "./components/TripReviews";
import CalendarWidget from "./components/CalendarWidget";
import TripOverviewTable from "./components/TripOverviewTable";
import AccessibilityInfo from "./components/components/AccessibilityInfo";

export default function TripPage({ params }) {
  const { id } = params;
  const { trips, fetchTrips, getTripById } = useTrip();
  const { lang } = useLanguage();
  const { theme, themeName } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase();
  const { messages } = useMessages();
  const { t } = useTranslation("header");
  const { t: ui } = useTranslation("ui");

  useEffect(() => { if (!trips.length) fetchTrips(); }, [trips.length, fetchTrips]);

  const trip = getTripById(id);
  if (!trip) return <main className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--muted)]">{ui("tripNotFound")}</main>;

  const tripTitle = trip.title?.[lang] || trip.title?.en || "Egypt tour";
  const tripDescription = trip.description?.[lang] || trip.description?.en || "Discover an unforgettable Egypt travel experience with WasetTravel.";
  const hasActivePurchase = purchases.some((purchase) => purchase.trip_id?.toString() === trip.id?.toString() && purchase.user_id?.toString() === userData?.id?.toString() && purchase.status !== "Cancelled");
  const tripSchema = { "@context": "https://schema.org", "@type": "TouristTrip", name: tripTitle, description: tripDescription, image: [trip.cover_image, ...(trip.gallery_images || []).map((image) => typeof image === "string" ? image : image?.url)].filter(Boolean), offers: { "@type": "Offer", price: trip.group_price, priceCurrency: trip.currency || "USD", availability: "https://schema.org/InStock" } };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }} />
      <Head><title>{tripTitle}</title><meta name="description" content={tripDescription} /></Head>
      <main className={`trip-detail-page site-shell min-h-screen overflow-hidden ${theme.text}`}>
        <Header />
        <div className="trip-detail-container mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 lg:px-12">
          <nav className="trip-detail-breadcrumb mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em]"><Link href={`/${lang}/trips`} className="transition hover:text-[#e0b873]">{t("Trips", { defaultValue: "Trips" })}</Link><FaArrowLeft className="text-[10px]" /><span className="max-w-[15rem] truncate">{tripTitle}</span></nav>
          <TripHeader trip={trip} lang={lang} />

          <div className="trip-detail-layout mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)]">
            <div className="min-w-0 space-y-6">
              <section className="trip-detail-meta grid gap-4 sm:grid-cols-2"><div className="stone-card rounded-2xl p-5"><p className="stone-kicker mb-2">{ui("destinations")}</p><TripCities trip={trip} lang={lang} theme={theme} themeName={themeName} /></div><div className="stone-card rounded-2xl p-5"><p className="stone-kicker mb-2">{ui("travelStyle")}</p><TripCategories trip={trip} lang={lang} theme={theme} themeName={themeName} /></div></section>
              <TripOverviewTable trip={trip} />
              <AccessibilityInfo theme={themeName} themeName={themeName} />
              <section className="grid gap-6 lg:grid-cols-2"><TripIncludes trip={trip} lang={lang} theme={theme} themeName={themeName} /><TripExclusions trip={trip} lang={lang} theme={theme} themeName={themeName} /></section>
              <TripItinerary trip={trip} lang={lang} theme={theme} themeName={themeName} />
              <TripReviews trip={trip} lang={lang} theme={theme} />
            </div>
            <aside className="trip-detail-booking lg:sticky lg:top-24"><div className="trip-detail-booking__label mb-3 flex items-center gap-2 px-1 text-sm"><FaMapMarkerAlt className="text-[#e0b873]" /> {ui("planJourney")}</div><CalendarWidget trip={trip} id={id} />{userData && String(userData.role || "").trim().toLowerCase() !== "admin" && hasActivePurchase && <div className="mt-4"><CancelButton trip={trip} theme={theme} /></div>}</aside>
          </div>
        </div>
        <Footer /><SignUpButton /><LoginModal />{userData && <ChatWidget />}{chatUser && <AdminChatWindow user={chatUser} admin={userData} messages={messages} onClose={() => setChatUser(null)} />}
      </main>
    </>
  );
}
