import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useData } from "@/context/DataContext";
import { useChat } from "@/context/ChatContext";
import { motion } from "framer-motion";
import { useMessages } from "@/context/MessageContext";

const BookingSummaryCard = ({
  tourName,
  participants,
  checkInPrice,
  checkIn,
  childrenCount,
  checkOut,
}) => {
  const { themeName } = useTheme();
  const { userData } = useAuth();
  const { handleLoginOpen } = useData();
  const { open, setOpen } = useChat(); // ✅ أضفت setMessageses هنا
  const { setMessageses,sendMessage } = useMessages(); // ✅ أضفت setMessageses هنا
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
    toast.error("⚠️ Please complete all booking details before proceeding.");
    return;
  }

  if (userData) {
    setOpen(true);

    // ✅ إرسال الرسالة للـ Admin عبر sendMessage
await sendMessage({
  user_id: userData?.id,
  user_name: userData?.name,
  user_image:
    userData?.avatar_url || userData?.image || "/default-avatar.png",
  content: `
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
  `,
  sender_type: "user",
  status: "sent",
});



    // ✅ إضافة رسالة تأكيد داخل الدردشة
    setMessageses((prev) => [
      ...prev,
      { sender: "assistant", content: "✅ Booking request recorded successfully." },
    ]);
  } else {
    handleLoginOpen();
    toast.error("You must log in to book the trip");
  }
};


  return (
    <div className={`booking-card ${themeName}`}>
      {/* Header */}
      <h2 className="booking-header">Booking Summary</h2>

      {/* Ticket Card */}
      <div className="ticket">
        {/* Left Side */}
        <div className="ticket-left">
          <p className="tour-name">
            {tourName ||
              "Private Cairo Tour – Giza Pyramids, Sphinx & Grand Egyptian Museum (GEM)"}
          </p>
          <p className="participants">Participants: {participants || 0}</p>
          <p className="participants">Children: {childrenCount || 0}</p>
        </div>

        {/* Tear Line */}
        <div className="ticket-line">
          <span>TEAR HERE</span>
        </div>

        {/* Right Side */}
        <div className="ticket-right">
          <p>Total:</p>
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
          <span className="text-xl">🛒</span>
          <span>Add to cart</span>

          {/* إيفيكت خلفي متحرك */}
          <span className="absolute inset-0 rounded-lg bg-white/10 blur-sm animate-pulse"></span>
        </motion.button>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
