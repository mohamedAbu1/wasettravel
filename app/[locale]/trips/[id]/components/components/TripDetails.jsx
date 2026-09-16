"use client";
import { FaShoppingCart, FaMoneyBillWave, FaUsers } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function TripDetails({ trip, groupSize }) {
  const { themeName } = useTheme();
  const { currency } = usePurchase();
  const { convertPrice } = useCurrency();

  const pricePerPerson = convertPrice(trip.price, trip.currency || "USD", currency || trip.currency);


  // ✅ السعر النهائي = السعر للفرد × عدد الأشخاص
  const totalPrice = (pricePerPerson * groupSize).toFixed(2);
  return (
    <div className="mb-6">
      <h2
        className={`text-[16px] mb-4 flex items-center gap-2 ${
          themeName === "dark" ? "text-white" : "text-[#11111186]"
        }`}
      >
        <FaShoppingCart className="w-6 h-6 text-[#c9a34a]" />
        {trip.title.en}
      </h2>

      {/* السعر للفرد */}
      <p
        className={`mb-2 font-medium flex items-center gap-2 ${
          themeName === "dark" ? "text-white" : "text-[#11111186]"
        }`}
      >
        <FaMoneyBillWave className="text-[#c9a34a]" />
        Price per person: {pricePerPerson} {currency || trip.currency}
      </p>

      {/* عدد الأشخاص */}
      <p
        className={`mb-2 font-medium flex items-center gap-2 ${
          themeName === "dark" ? "text-white" : "text-[#11111186]"
        }`}
      >
        <FaUsers className="text-[#c9a34a]" />
        Group size: {groupSize}
      </p>

      {/* السعر النهائي */}
      <p
        className={`mb-2 font-bold flex items-center gap-2 ${
          themeName === "dark" ? "text-yellow-300" : "text-[#11111194]"
        }`}
      >
        <FaMoneyBillWave className="text-[#c9a34a]" />
        Total price: {totalPrice} {currency || trip.currency}
      </p>
    </div>
  );
}
