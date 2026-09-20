import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { isPrimaryAdmin, requireUser } from "@/lib/auth/admin";

// ✅ تحديث حالة الإشعار إلى مقروء
export async function PUT(req, { params }) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;
  try {
    const db = await connectDB();
    const { id } = params; // نأخذ id من الرابط

    const isAdmin = isPrimaryAdmin(auth.user);
    await db.execute(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND ${isAdmin ? "(admin_id = ? OR user_id = ?)" : "user_id = ?"}`,
      isAdmin ? [id, auth.user.id, auth.user.id] : [id, auth.user.id],
    );

    return NextResponse.json({ success: true, message: "تم تحديث الإشعار إلى مقروء" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
