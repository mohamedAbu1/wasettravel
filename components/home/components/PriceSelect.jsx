"use client";

import { FaDollarSign, FaEuroSign } from "react-icons/fa";
import { usePurchase } from "@/context/PurchaseContext";
import TravelSelectField from "./TravelSelectField";

export default function PriceSelect({ price, setPrice, t }) {
  const { currency } = usePurchase();
  const rate = 0.85;
  const symbol = currency === "EUR" ? "€" : "$";
  const Icon = currency === "EUR" ? FaEuroSign : FaDollarSign;
  const ranges = [
    { value: "Economy", min: 0, max: 199 },
    { value: "Standard", min: 200, max: 599 },
    { value: "Luxury", min: 600, max: Infinity },
  ];
  const options = ranges.map((range) => {
    const min = currency === "EUR" ? Math.round(range.min * rate) : range.min;
    const max = currency === "EUR" ? Math.round(range.max * rate) : range.max;
    return {
      value: range.value,
      label: range.max === Infinity ? `${min}+ ${symbol}` : `${min} – ${max} ${symbol}`,
    };
  });

  return (
    <TravelSelectField
      className="travel-select-field--budget"
      label={currency === "USD" ? t("MaxPrice") : t("MaxPrice2")}
      value={price}
      onChange={setPrice}
      options={options}
      icon={<Icon aria-hidden="true" />}
    />
  );
}
