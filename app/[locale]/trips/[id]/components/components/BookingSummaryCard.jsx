import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useData } from "@/context/DataContext";
import { useChat } from "@/context/ChatContext";
import { motion } from "framer-motion";
const BookingSummaryCard = ({
  tourName,
  participants,
  checkInPrice,
  children,
}) => {
  const { themeName } = useTheme();
  const { userData } = useAuth();
  const { handleLoginOpen } = useData();
  const { open, setOpen } = useChat();

  // حساب سعر الأطفال (مثال: نصف السعر)
  const childrenPrice = (checkInPrice * children) / 2;

  // السعر الأساسي
  let total = checkInPrice * participants + childrenPrice;

  // تطبيق الخصم إذا كان أكثر من فرد واحد
  if (participants > 1) {
    total = total * 0.6; // خصم 60% → يبقى 60% فقط
  }

  const handleBookingClick = () => {
    if (userData) {
      // ✅ المستخدم مسجل دخول → افتح الدردشة
      setOpen(!open);
    } else {
      // ❌ المستخدم غير مسجل دخول → افتح تسجيل الدخول + توست
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
          <p className="participants">Participants: {participants || 1}</p>
          <p className="children">Children: {children || 0}</p>
        </div>

        {/* Tear Line */}
        <div className="ticket-line">
          <span>TEAR HERE</span>
        </div>

        {/* Right Side */}
        <div className="ticket-right">
          <p>Total:</p>
          <p className="total">{`$${total.toFixed(2)}`}</p>
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
