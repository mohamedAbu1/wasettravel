import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { openWhatsAppBooking } from "@/lib/whatsappBooking";
import { getAdultTripPrice } from "@/lib/tripPricing";

const formatDate = (value) => {
  if (!value) return "Not selected";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const BookingSummaryCard = ({
  trip,
  tripTitle,
  participants,
  childrenCount,
  checkIn,
  checkOut,
  currency,
  tripCurrency,
  convertPrice,
}) => {
  const { themeName } = useTheme();
  const { t } = useTranslation("tripsId");
  const pricePerAdultBase = getAdultTripPrice(trip, participants || 1);
  const childrenPriceBase = pricePerAdultBase / 2;
  const totalBase = participants > 0
    ? pricePerAdultBase * participants + childrenPriceBase * childrenCount
    : 0;
  const pricePerAdult = convertPrice(pricePerAdultBase, tripCurrency, currency);
  const total = convertPrice(totalBase, tripCurrency, currency);
  const title = tripTitle || trip?.title?.en || "Selected trip";

  const handleBookingClick = () => {
    if (!participants || !checkIn) {
      toast.error(`⚠️ ${t("bookingDetailsRequired")}`);
      return;
    }

    const message = `
🧾 **Booking Summary**

---

🏷️ **Tour:** ${title}

👤 **Adults:** ${participants}  👶 **Children:** ${childrenCount}

📅 **Start date:** ${formatDate(checkIn)}
${checkOut ? `📅 **End date:** ${formatDate(checkOut)}\n` : ""}
💵 **Price per adult:** ${pricePerAdult} ${currency}

💰 **Total:** ${total} ${currency}

---

✅ **Please confirm availability and assist the guest.**
    `;
    openWhatsAppBooking(message);
    toast.success("WhatsApp opened. Send the message to confirm your request.");
  };

  return (
    <div className={`booking-card trip-booking-summary ${themeName}`}>
      <h2 className="booking-header">{t("bookingSummary")}</h2>

      <div className="ticket">
        <div className="ticket-left">
          <p className="tour-name">{title}</p>
          <p className="participants">{t("participants")}: {participants || 0}</p>
          <p className="participants">{t("children")}: {childrenCount || 0}</p>
          {participants > 0 && <p className="participants">Price per adult: {pricePerAdult} {currency}</p>}
        </div>

        <div className="ticket-line"><span>{t("tearHere")}</span></div>

        <div className="ticket-right">
          <p>{t("total")}:</p>
          <p className="total">{total} {currency}</p>
        </div>
      </div>

      <div className="footer">
        <motion.button
          type="button"
          onClick={handleBookingClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative w-full text-center flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-lg font-semibold transition ${themeName === "dark" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/50" : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg"}`}
        >
          <FaWhatsapp className="text-xl" />
          <span>Continue on WhatsApp</span>
        </motion.button>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
