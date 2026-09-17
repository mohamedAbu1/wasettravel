import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserToken, sendPushNotification } from "@/lib/notifications";
import { requireAdmin, requireUser } from "@/lib/auth/admin";

// ✅ إضافة إشعار جديد + إرسال إشعار للموبايل
export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const db = await connectDB();
    const body = await req.json();

    const id = uuidv4(); // توليد id فريد

    await db.execute(
      `INSERT INTO notifications 
       (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, type, created_at, is_read) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`,
      [
        id,
        body.admin_id,
        body.event_type,
        body.message,
        body.user_id,
        body.user_name,
        body.user_email,
        body.user_image,
        body.trip_id,
        body.type,
      ],
    );

    // 🟢 اجلب الـ token من جدول push_tokens
    const expoPushToken = await getUserToken(body.user_id);
    if (expoPushToken) {
      // 🟢 استدعاء API Route send-notification
      await sendPushNotification(expoPushToken, `إشعار جديد (${body.event_type})`, body.message);
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// ✅ جلب الإشعارات
export async function GET(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;

  try {
    const db = await connectDB();
    const isAdmin = String(auth.user.role || "").toLowerCase() === "admin";
    const [rows] = await db.execute(
      `SELECT id, admin_id, event_type, user_id, message, created_at_second, user_name, user_email, user_image, created_at, is_read, trip_id
       FROM notifications
       ${isAdmin ? "WHERE admin_id = ? OR user_id = ?" : "WHERE user_id = ?"}
       ORDER BY created_at DESC`,
      isAdmin ? [auth.user.id, auth.user.id] : [auth.user.id],
    );

    return NextResponse.json({ success: true, notifications: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
