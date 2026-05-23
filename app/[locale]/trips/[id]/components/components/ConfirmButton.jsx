"use client";
import { FaCheckCircle, FaCreditCard } from "react-icons/fa";
import { useState } from "react";
import { usePurchase } from "@/context/PurchaseContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function ConfirmButton({
  trip,
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
  const { purchaseTrip } = usePurchase();
  const [loading, setLoading] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please log in to complete the payment.");
      return;
    }
    setLoadingPay(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: trip?.price || 400,
          userDetails: {
            email: user.email,
            firstName: user.firstName || user.name?.split(" ")[0],
            lastName: user.lastName || user.name?.split(" ")[1],
            phone: user.phone || "+201000000000",
          },
        }),
      });
      const data = await res.json();
      if (data.token) {
        const iframeId = process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;
        // ✅ التوجيه الصحيح للسيرفر الجديد الخاص بحسابك
        window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID}?payment_token=${data.token}`;
      } else {
        toast.error("Failed to get payment token.");
      }
    } catch (err) {
      toast.error("Payment gateway error.");
    } finally {
      setLoadingPay(false);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    const bookingData = {
      tripId: trip,
      numPersons: groupSize,
      hasChildren,
      numChildren: childrenCount,
      hasPets,
      petTypes: pets,
      hasGuide,
      selectedLanguages: guideLanguages,
      arrivalDate,
      departureDate,
      userId: user?.id,
      status: "Pending",
      platform: "web",
    };
    const result = await purchaseTrip(bookingData);
    if (result.success) {
      toast.success("✅ Trip booked successfully!");
      toast.info("💡 You can pay later from your dashboard.");
      onClose();
    } else {
      toast.error("❌ " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={handlePurchase}
        disabled={loading || loadingPay}
        className={`mt-4 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer text-white ${loading ? "opacity-50 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"}`}
      >
        <FaCheckCircle className="w-5 h-5" />
        {loading ? "Processing..." : "Book Now (Pay Later)"}
      </button>
      <button
        onClick={handlePayment}
        disabled={loadingPay || loading}
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer text-white ${loadingPay ? "opacity-50 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"}`}
      >
        <FaCreditCard className="w-5 h-5" />
                {loadingPay ? "Payment is being processed..." : "Pay online now"}}
      </button>
    </div>
  );
}
