import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { fallbackCategories } from "@/lib/catalogFallback";

export async function GET() {
  try {

    const db = await connectDB();

    const [rows] = await db.execute("SELECT * FROM categories ORDER BY name ASC");

    return NextResponse.json({ success: true, categories: rows });
  } catch (error) {
    console.error("Categories database unavailable; serving local catalog:", error.message);
    return NextResponse.json({ success: true, categories: fallbackCategories, fallback: true });
  }
}
