import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { fallbackCities } from "@/lib/catalogFallback";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT id, name, images FROM cities ORDER BY id ASC");
    return NextResponse.json({ success: true, cities: rows });
  } catch (error) {
    console.error("Cities database unavailable; serving local catalog:", error.message);
    return NextResponse.json({ success: true, cities: fallbackCities, fallback: true });
  }
}
