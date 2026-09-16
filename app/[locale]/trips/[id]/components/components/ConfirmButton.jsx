"use client";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { openWhatsAppBooking } from "@/lib/whatsappBooking";

export default function ConfirmButton({
  trip,
  tripTitle,
  onClose,
  arrivalDate,
  departureDate,
  hasChildren,
  childrenCount,
  hasPets,
  pets,
  groupSize,
  hasGuide,
  guideLanguages,
}) {
  const handleWhatsAppBooking = () => {
    const message = `🧾 Booking request\n\nTrip: ${tripTitle || trip?.title?.en || trip?.title || trip || "Egypt tour"}\nAdults: ${groupSize || 0}\nChildren: ${hasChildren ? childrenCount : 0}\nArrival: ${arrivalDate || "Not specified"}\nDeparture: ${departureDate || "Not specified"}\nGuide: ${hasGuide ? guideLanguages.join(", ") || "Requested" : "No"}\nPets: ${hasPets ? pets.join(", ") || "Yes" : "No"}\n\nPlease confirm availability and the final price.`;
    openWhatsAppBooking(message);
    toast.success("WhatsApp opened. Send the message to confirm your request.");
    onClose();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <button onClick={handleWhatsAppBooking} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-white transition hover:bg-[#1da851] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30">
        <FaWhatsapp className="h-5 w-5" /> Continue on WhatsApp
      </button>
    </div>
  );
}
