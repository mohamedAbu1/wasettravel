export function numericPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) && price > 0 ? price : 0;
}

// Solo pricing is the public price for one adult. Group pricing is the
// per-person price when a booking has more than one adult.
export function getAdultTripPrice(trip, adults = 1) {
  const soloPrice = numericPrice(trip?.solo_price);
  const groupPrice = numericPrice(trip?.group_price);

  if (Number(adults) > 1 && groupPrice > 0) return groupPrice;
  return soloPrice || groupPrice;
}

export function currencySymbol(currency) {
  switch (String(currency || "USD").toUpperCase()) {
    case "EUR":
      return "€";
    case "EGP":
      return "EGP";
    default:
      return "$";
  }
}
