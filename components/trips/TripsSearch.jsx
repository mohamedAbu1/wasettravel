"use client"
import React from "react";
import { FaSearch, FaThLarge, FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { tripCopy } from "@/lib/tripUiCopy";

export default function TripsSearch({ search, setSearch, cardStyle, setCardStyle }) {
  const { i18n, t } = useTranslation("trips");
  const language = i18n.language?.split("-")[0] || "en";

  return (
    <div className="trips-searchbar">
      <div className="trips-searchbar__input">
      <FaSearch aria-hidden="true" />
      <input
        type="text"
        placeholder={t("Searchtrips")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label={t("Searchtrips")}
        className="min-w-0 flex-1"
      />
      {search ? <button type="button" onClick={() => setSearch("")} aria-label={tripCopy(language, "clearSearch")}><FaTimes /></button> : null}
      </div>

      {/* أزرار تغيير الاستايل */}
      <div className="trips-view-toggle" role="group" aria-label={tripCopy(language, "changeLayout")}>
        <button
          onClick={() => setCardStyle("vertical")}
          className={`trips-view-toggle__button ${cardStyle === "vertical" ? "is-active" : ""}`}
          aria-pressed={cardStyle === "vertical"}
        >
          <FaThLarge /> {t("Vertical")}
        </button>

        <button
          onClick={() => setCardStyle("horizontal")}
          className={`trips-view-toggle__button ${cardStyle === "horizontal" ? "is-active" : ""}`}
          aria-pressed={cardStyle === "horizontal"}
        >
          <FaBars /> {t("Horizontal")} 
        </button>
      </div>
    </div>
  );
}
