import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/admin";

// Online checkout is intentionally disabled while bookings are handled by WhatsApp.
// Keeping this endpoint closed prevents arbitrary public Paymob orders and amount tampering.
export async function POST(request) {
  const auth = requireUser(request);
  if (auth.response) return auth.response;

  return NextResponse.json(
    { error: "Online checkout is disabled. Please complete your booking through WhatsApp." },
    { status: 410 },
  );
}
