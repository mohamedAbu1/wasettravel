import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";


export async function DELETE(req, { params }) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;
  try {
    const db = await connectDB();
    const { id } = params; // نأخذ id من الرابط مثل /api/notifications/[id]

    const isAdmin = String(auth.user.role || "").toLowerCase() === "admin";
    await db.execute(
      `DELETE FROM notifications WHERE id = ? AND ${isAdmin ? "(admin_id = ? OR user_id = ?)" : "user_id = ?"}`,
      isAdmin ? [id, auth.user.id, auth.user.id] : [id, auth.user.id],
    );

    return NextResponse.json({ success: true, message: "تم حذف الإشعار بنجاح" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
