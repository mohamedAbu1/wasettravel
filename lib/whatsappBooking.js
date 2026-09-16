export const WHATSAPP_NUMBER = "201091126069";

export function buildWhatsAppBookingUrl(message) {
  const normalizedMessage = String(message || "").trim();
  if (!normalizedMessage) return `https://wa.me/${WHATSAPP_NUMBER}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(normalizedMessage)}`;
}

export function openWhatsAppBooking(message) {
  const url = buildWhatsAppBookingUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
}
