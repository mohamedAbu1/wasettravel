"use client";
import { FaWhatsapp } from "react-icons/fa";
import { openWhatsAppBooking } from "@/lib/whatsappBooking";

export default function PurchaseButton({ trip }) {
  return (
      <button
        onClick={() => openWhatsAppBooking(`🧾 Booking request\n\nTrip: ${trip?.title?.en || trip?.title || trip?.id || "Egypt tour"}\n\nPlease confirm availability and the final price.`)}
        aria-label="Open purchase modal to buy this trip"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-[#1da851] hover:shadow-2xl"
      >
        <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
        Book via WhatsApp
      </button>
  );
}
