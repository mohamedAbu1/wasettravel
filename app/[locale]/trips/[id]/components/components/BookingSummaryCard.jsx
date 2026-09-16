import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { openWhatsAppBooking } from "@/lib/whatsappBooking";

const BookingSummaryCard = ({
  tourName,
  participants,
  checkInPrice,
  checkIn,
  childrenCount,
  checkOut,
}) => {
  const { themeName } = useTheme();
  const { t } = useTranslation("tripsId");
  // حساب سعر الأطفال (مثال: نصف السعر)
  const childrenPrice = (checkInPrice * childrenCount) / 2;
  let total = "$0,00";
  // السعر الأساسي
  total = checkInPrice * participants + childrenPrice;

  // تطبيق الخصم إذا كان أكثر من فرد واحد
  if (participants > 1) {
    total = total * 0.6; // خصم 60% → يبقى 60% فقط
  }
const handleBookingClick = async () => {
  if (!participants || !checkInPrice || !checkIn || !checkOut) {
    toast.error(`⚠️ ${t("bookingDetailsRequired")}`);
    return;
  }

  const message = `
🧾 **Booking Summary**

---

🏷️ **Tour:** ${tourName || "Private Cairo Tour – Giza Pyramids, Sphinx & GEM"}


👤 **Adults:** ${participants}  👶 **Children:** ${childrenCount}

📅 **Check-in:** ${checkIn}

📅 **Check-out:** ${checkOut}

💵 **Price per adult:** $${checkInPrice}

💰 **Total:** $${total.toFixed(2)}

---

✅ **Please confirm availability and assist the guest.**
  `;
  openWhatsAppBooking(message);
  toast.success("WhatsApp opened. Send the message to confirm your request.");
};


  return (
    <div className={`booking-card trip-booking-summary ${themeName}`}>
      {/* Header */}
      <h2 className="booking-header">{t("bookingSummary")}</h2>

      {/* Ticket Card */}
      <div className="ticket">
        {/* Left Side */}
        <div className="ticket-left">
          <p className="tour-name">
            {tourName ||
              "Private Cairo Tour – Giza Pyramids, Sphinx & Grand Egyptian Museum (GEM)"}
          </p>
          <p className="participants">{t("participants")}: {participants || 0}</p>
          <p className="participants">{t("children")}: {childrenCount || 0}</p>
        </div>

        {/* Tear Line */}
        <div className="ticket-line">
          <span>{t("tearHere")}</span>
        </div>

        {/* Right Side */}
        <div className="ticket-right">
          <p>{t("total")}:</p>
          <p className="total">
            {!isNaN(total) ? `$${total.toFixed(2)}` : "$0.00"}
          </p>

          {/* {participants > 1 && (
            <p className="discount text-green-600 text-sm mt-1">
              🎉 40% discount applied!
            </p>
          )} */}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <motion.button
          onClick={handleBookingClick}
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-full text-center flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-lg font-semibold transition 
      ${
        themeName === "dark"
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/50"
          : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg"
      }`}
        >
          <FaWhatsapp className="text-xl" />
          <span>Continue on WhatsApp</span>

          {/* إيفيكت خلفي متحرك */}
          <span className="absolute inset-0 rounded-lg bg-white/10 blur-sm animate-pulse"></span>
        </motion.button>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
