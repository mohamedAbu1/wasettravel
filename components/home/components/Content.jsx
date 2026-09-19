"use client";

import { useData } from "@/context/DataContext";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import CalendarSC from "./CalendarSC";
import CitySelect from "./CitySelect";
import CategorySelect from "./CategorySelect";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { encodeBase64Json } from "@/lib/utils/base64";
import { useLanguage } from "@/context/LanguageContext";

export default function Content() {
  const {
    city,
    setCity,
    group_price,
    tripType,
    setTripType,
    arrival,
    departure,
  } = useData();
  const { i18n, t } = useTranslation("home");
  const { cities: allCities, categories: allCategories } = useCitiesCategories();
  const router = useRouter();
  const currentLang = i18n.language || "en";
  const { lang } = useLanguage();
  const isFormValid = Boolean(city && tripType && arrival && departure);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = {
      city: [city],
      category: [tripType],
      group_price,
      arrival,
      departure,
      popular: false,
    };
    router.push(`/${lang}/trips?data=${encodeBase64Json(query)}`);
  };

  return (
    <div className="hero-search-content travel-search-content">
      <div className="hero-filter-intro">
        <div className="hero-filter-intro__icon" aria-hidden="true"><FiSearch /></div>
        <div>
          <p className="hero-filter-intro__eyebrow">
            {t("SearchEyebrow", { defaultValue: "Your journey, your way" })}
          </p>
          <p className="hero-filter-intro__title">
            {t("SearchTitle", { defaultValue: "Build your perfect Egypt trip" })}
          </p>
        </div>
      </div>

      <form
        className="hero-filter-form"
        onSubmit={handleSearch}
        aria-label={t("TripSearch", { defaultValue: "Find an Egypt trip" })}
      >
        <div className="hero-filter-control">
          <span className="hero-filter-control__label">{t("SelectCity")}</span>
          <CitySelect
            allCities={allCities}
            currentLang={currentLang}
            city={city}
            setCity={setCity}
            t={t}
          />
        </div>

        <div className="hero-filter-control">
          <span className="hero-filter-control__label">{t("SelectCategory")}</span>
          <CategorySelect
            allCategories={allCategories}
            currentLang={currentLang}
            tripType={tripType}
            setTripType={setTripType}
            t={t}
          />
        </div>

        <div className="hero-filter-control hero-filter-control--dates">
          <span className="hero-filter-control__label">{t("TravelDates", { defaultValue: "Travel dates" })}</span>
          <CalendarSC />
        </div>

      <button
          className="hero-filter-submit"
          type="submit"
          disabled={!isFormValid}
          aria-label={isFormValid ? t("Search") : t("CompleteSearchFilters", { defaultValue: "Select a city, category and travel dates to continue" })}
        >
          <span>{t("Search")}</span>
          <span className="hero-filter-submit__arrow" aria-hidden="true">↗</span>
      </button>
      </form>

      <div className="hero-filter-footer">
        <span><i aria-hidden="true" /> {t("LocalPlanning", { defaultValue: "Local planning support" })}</span>
        <span>{t("FlexibleBooking", { defaultValue: "Flexible booking" })}</span>
        <span>{t("SecureCheckout", { defaultValue: "Secure checkout" })}</span>
      </div>
    </div>
  );
}
