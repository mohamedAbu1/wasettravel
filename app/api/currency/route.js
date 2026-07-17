import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// ✅ جلب الأسعار
export async function GET() {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM currency_rates");
  return NextResponse.json(rows, { status: 200 });
}

// ✅ تعديل سجل موجود فقط
export async function PUT(req) {
  const { id, rate } = await req.json();
  const db = await connectDB();

  await db.query(
    `UPDATE currency_rates 
     SET rate = ?, updated_at = NOW() 
     WHERE id = ?`,
    [rate, id]
  );

  return NextResponse.json({ message: "Rate updated successfully!" }, { status: 200 });
}
