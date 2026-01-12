/* eslint-disable react-hooks/static-components */
import React from "react";
import { FaMapMarkerAlt, FaDollarSign, FaTags, FaFire } from "react-icons/fa";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useTranslation } from "react-i18next";

const AnkhIcon = () => (
  <span className="text-[#c9a34a] dark:text-gold text-xl font-bold">☥</span>
);

export default function TripsFilter({ filters, setFilters }) {
  const { cities: allCities, categories: allCategories, loading } = useCitiesCategories();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const { t } = useTranslation("trips");

  const handleCheckboxChange = (type, value) => {
    const current = filters[type] || [];
    if (current.includes(value)) {
      setFilters({ ...filters, [type]: current.filter((v) => v !== value) });
    } else {
      setFilters({ ...filters, [type]: [...current, value] });
    }
  };

  const priceRanges = [
    { label: "0 - 450 $", value: "0-450" },
    { label: "451 - 900 $", value: "451-900" },
    { label: "901 - 1500 $", value: "901-1500" },
    { label: "1500+ $", value: "1500+" },
  ];

  const Divider = () => (
    <div className="relative flex items-center justify-center my-4">
      <hr
        className={`w-full border-t-2 ${
          filters.themeName === "dark"
            ? "border-gold/40"
            : "border-[#c9a34a]/40"
        }`}
      />
      <div className="absolute bg-inherit px-2">
        <AnkhIcon />
      </div>
    </div>
  );

  if (loading) {
    return <p className="text-center text-gray-500">{t("Loading")}</p>;
  }

  return (
    <aside
      className={`p-6 rounded-xl shadow-lg transition ${
        filters.themeName === "dark"
          ? "bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] border border-[#c9a34a]/40 text-gray-100"
          : "bg-white/0 border border-[#c9a34a]/30 text-[#3a2c0a] "
      }`}
    >
      <h3
        className={`text-xl font-bold mb-6 ${
          filters.themeName === "dark" ? "text-[#c9a34a]" : "text-[#3a2c0a]"
        }`}
      >
        {t("Filters")}
      </h3>

      <div className="flex flex-col gap-8">
        {/* المدن */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3">
            <FaMapMarkerAlt className="text-[#c9a34a]" /> {t("Cities")} :
          </label>
          <div className="grid grid-cols-2 gap-2 ml-6">
            {allCities.map((city) => {
              const cityName =
                city.name?.[currentLang] || city.name?.["en"] || city.name;
              return (
                <label
                  key={city.id ?? cityName}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
                >
                  <input
                    type="checkbox"
                    className="accent-[#c9a34a] cursor-pointer"
                    checked={filters.city?.includes(cityName) || false}
                    onChange={() => handleCheckboxChange("city", cityName)}
                  />
                  {cityName}
                </label>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* الكاتجري */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3">
            <FaTags className="text-[#c9a34a]" /> {t("Categories")}:
          </label>
          <div className="grid grid-cols-2 gap-2 ml-6">
            {allCategories.map((cat) => {
              const categoryName =
                cat.name?.[currentLang] || cat.name?.["en"] || cat.name;
              return (
                <label
                  key={cat.id ?? categoryName}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
                >
                  <input
                    type="checkbox"
                    className="accent-[#c9a34a] cursor-pointer"
                    checked={filters.category?.includes(categoryName) || false}
                    onChange={() => handleCheckboxChange("category", categoryName)}
                  />
                  {categoryName}
                </label>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* السعر */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3">
            <FaDollarSign className="text-[#c9a34a]" />{t("PriceRange")} :
          </label>
          <div className="flex flex-col gap-2 ml-6">
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
              >
                <input
                  type="radio"
                  name="priceRange"
                  className="accent-[#c9a34a] cursor-pointer"
                  checked={filters.price === range.value}
                  onChange={() => setFilters({ ...filters, price: range.value })}
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>

        <Divider />

        {/* الأكثر طلباً */}
        <div>
          <label className="flex items-center gap-2 font-semibold cursor-pointer hover:text-[#c9a34a] transition">
            <FaFire className="text-[#c9a34a]" />{t("MostPopular")} 
            <input
              type="checkbox"
              className="ml-2 accent-[#c9a34a] cursor-pointer"
              checked={filters.popular || false}
              onChange={(e) =>
                setFilters({ ...filters, popular: e.target.checked })
              }
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
