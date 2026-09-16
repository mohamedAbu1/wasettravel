"use client";

import { FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";
import { usePurchase } from "@/context/PurchaseContext";
import { useCurrency } from "@/context/CurrencyContext";
import TravelSelectField from "./TravelSelectField";

export default function PriceSelect({ price, setPrice, t }) {
  const { currency } = usePurchase();
  const { convertPrice } = useCurrency();
  const symbol = currency === "EUR" ? "€" : currency === "EGP" ? "E£" : "$";
  const Icon = currency === "EUR" ? FaEuroSign : currency === "EGP" ? FaPoundSign : FaDollarSign;
  const ranges = [
    { value: "Economy", min: 0, max: 199 },
    { value: "Standard", min: 200, max: 599 },
    { value: "Luxury", min: 600, max: Infinity },
  ];
  const options = ranges.map((range) => {
    const min = currency === "USD" ? range.min : Math.round(Number(convertPrice(range.min, "USD", currency, 0)));
    const max = range.max === Infinity ? Infinity : currency === "USD" ? range.max : Math.round(Number(convertPrice(range.max, "USD", currency, 0)));
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
