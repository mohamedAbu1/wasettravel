"use client";

import React from "react";
import { FaCheck, FaChevronDown, FaFire, FaMapMarkerAlt, FaRedoAlt, FaTags, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useQueryFilters } from "@/context/QueryContext";

function getLabel(value, language) {
  if (!value) return "";
  if (typeof value === "object") return value[language] || value.en || Object.values(value)[0] || "";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" ? parsed[language] || parsed.en || Object.values(parsed)[0] || "" : value;
    } catch {
      return value;
    }
  }
  return String(value);
}

function Choice({ checked, label, onChange, type = "checkbox", name }) {
  return (
    <label className={`trip-filter-choice ${checked ? "is-selected" : ""}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} />
      <span className="trip-filter-choice__box" aria-hidden="true">{checked ? <FaCheck /> : null}</span>
      <span className="trip-filter-choice__label">{label}</span>
    </label>
  );
}

export default function TripsFilter({ allCities = [], allCategories = [], loading, mobileOpen = false, onClose }) {
  const { i18n, t } = useTranslation("trips");
  const language = i18n.language?.split("-")[0] || "en";
  const { city, category, group_price, popular, updateValue, resetFilters } = useQueryFilters();
  const selectedCities = city === "all" ? [] : Array.isArray(city) ? city : [city];
  const selectedCategories = category === "all" ? [] : Array.isArray(category) ? category : [category];
  const selectedCount = selectedCities.length + selectedCategories.length + (group_price !== "All" ? 1 : 0) + (popular ? 1 : 0);

  const toggleFilter = (key, current, value) => {
    const currentValues = current === "all" ? [] : Array.isArray(current) ? current : [current];
    const next = currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value];
    updateValue(key, next.length ? next : "all");
  };

  const priceRanges = [
    { label: t("All", { defaultValue: "All prices" }), value: "All" },
    { label: "0 – 199 USD", value: "Economy" },
    { label: "200 – 599 USD", value: "Standard" },
    { label: "600+ USD", value: "Luxury" },
  ];

  if (loading) return <div className="trip-filter trip-filter--loading" aria-busy="true">{t("Loading", { defaultValue: "Loading filters…" })}</div>;

  return (
    <>
      {mobileOpen ? <button className="trip-filter-backdrop" type="button" aria-label="Close filters" onClick={onClose} /> : null}
      <aside className={`trip-filter ${mobileOpen ? "trip-filter--mobile-open" : ""}`} aria-label={t("Filters", { defaultValue: "Trip filters" })}>
        <div className="trip-filter__header">
          <div><span className="trip-filter__eyebrow">WasetTravel</span><h2>{t("Filters", { defaultValue: "Refine your journey" })}</h2></div>
          {mobileOpen ? <button className="trip-filter__close" type="button" onClick={onClose} aria-label="Close filters"><FaTimes /></button> : null}
        </div>
        <div className="trip-filter__summary">
          <span>{selectedCount ? `${selectedCount} ${selectedCount === 1 ? "filter" : "filters"} applied` : "All journeys"}</span>
          <button type="button" onClick={() => { resetFilters(); onClose?.(); }} disabled={!selectedCount}><FaRedoAlt /> {t("Reset", { defaultValue: "Reset" })}</button>
        </div>
        <div className="trip-filter__sections">
          <details open>
            <summary><span><FaMapMarkerAlt /> {t("Cities", { defaultValue: "Destinations" })}</span><FaChevronDown /></summary>
            <div className="trip-filter__options">
              <Choice label={t("All", { defaultValue: "All destinations" })} checked={city === "all"} onChange={() => updateValue("city", "all")} />
              {allCities.map((item) => { const label = getLabel(item.name, language); return <Choice key={item.id || label} label={label} checked={selectedCities.includes(label)} onChange={() => toggleFilter("city", city, label)} />; })}
            </div>
          </details>
          <details open>
            <summary><span><FaTags /> {t("Categories", { defaultValue: "Experiences" })}</span><FaChevronDown /></summary>
            <div className="trip-filter__options">
              <Choice label={t("All", { defaultValue: "All experiences" })} checked={category === "all"} onChange={() => updateValue("category", "all")} />
              {allCategories.map((item) => { const label = getLabel(item.name, language); return <Choice key={item.id || label} label={label} checked={selectedCategories.includes(label)} onChange={() => toggleFilter("category", category, label)} />; })}
            </div>
          </details>
          <details open>
            <summary><span>◇ {t("PriceRange", { defaultValue: "Price range" })}</span><FaChevronDown /></summary>
            <div className="trip-filter__options">
              {priceRanges.map((range) => <Choice key={range.value} type="radio" name="price-range" label={range.label} checked={group_price === range.value} onChange={() => updateValue("group_price", range.value)} />)}
            </div>
          </details>
          <label className={`trip-filter__popular ${popular ? "is-selected" : ""}`}>
            <span><FaFire /> {t("MostPopular", { defaultValue: "Most popular journeys" })}</span>
            <input type="checkbox" checked={popular === true} onChange={(event) => updateValue("popular", event.target.checked)} />
            <span className="trip-filter__switch" aria-hidden="true" />
          </label>
        </div>
        {mobileOpen ? <button className="trip-filter__apply" type="button" onClick={onClose}>{t("Apply", { defaultValue: "Show journeys" })}</button> : null}
      </aside>
    </>
  );
}
