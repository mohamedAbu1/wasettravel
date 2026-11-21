// /app/api/update-status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // ملف الاتصال بقاعدة بيانات MySQL
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const { purchaseId, status } = await req.json();
    const normalizedStatus = String(status || "").trim();
    if (!purchaseId || !["Pending", "Confirmed", "Cancelled", "Completed"].includes(normalizedStatus)) {
      return NextResponse.json({ error: "Invalid purchase status" }, { status: 400 });
    }
    const db = await connectDB();

    // ✅ تحديث حالة الحجز
    const [result] = await db.query(
      `UPDATE purchases 
       SET status = ?, updated_at = NOW() 
       WHERE id = ?`,
      [normalizedStatus, purchaseId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to update the purchase status right now" }, { status: 500 });
  }
}
