import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

// ✅ تحديث حالة الإشعار إلى مقروء
export async function PUT(req, { params }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;
  try {
    const db = await connectDB();
    const { id } = params; // نأخذ id من الرابط

    await db.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "تم تحديث الإشعار إلى مقروء" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
