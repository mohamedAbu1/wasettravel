import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserToken, sendPushNotification } from "@/lib/notifications";
import { isPrimaryAdmin, requireAdmin, requireUser } from "@/lib/auth/admin";

// ✅ إضافة إشعار جديد + إرسال إشعار للموبايل
export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const db = await connectDB();
    const body = await req.json();
    if (!body.user_id || !body.event_type || !String(body.message || "").trim()) {
      return NextResponse.json({ success: false, error: "user_id, event_type and message are required" }, { status: 400 });
    }

    const id = uuidv4(); // توليد id فريد

    await db.execute(
      `INSERT INTO notifications 
       (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, created_at, is_read, message_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0, ?)`,
      [
        id,
        auth.user.id,
        body.event_type,
        body.message,
        body.user_id,
        body.user_name || "Traveler",
        body.user_email || "",
        body.user_image || "/default-avatar.png",
        body.trip_id || "00000000-0000-0000-0000-000000000000",
        body.message_id || uuidv4(),
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
    const isAdmin = isPrimaryAdmin(auth.user);
    const [rows] = await db.execute(
      `SELECT id, admin_id, event_type, user_id, message, user_name, user_email, user_image, created_at, is_read, trip_id, message_id
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
