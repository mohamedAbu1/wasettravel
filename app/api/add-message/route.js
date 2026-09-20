import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getUserToken, sendPushNotification } from "@/lib/notifications";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const db = await connectDB();
    const { userId, event_type, message } = await req.json();
    if (!userId || !event_type || !String(message || "").trim()) {
      return NextResponse.json({ success: false, error: "userId, event_type and message are required" }, { status: 400 });
    }

    const [users] = await db.query("SELECT name, email, avatar_url FROM users WHERE id = ? LIMIT 1", [userId]);
    if (!users.length) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    const user = users[0];
    const notificationId = uuidv4();
    const messageId = uuidv4();

    await db.query(
      `INSERT INTO notifications
       (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, created_at, is_read, message_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0, ?)`,
      [notificationId, auth.user.id, event_type, String(message).trim(), userId, user.name || "Traveler", user.email || "", user.avatar_url || "/default-avatar.png", "00000000-0000-0000-0000-000000000000", messageId],
    );

    const expoPushToken = await getUserToken(userId);
    if (expoPushToken) await sendPushNotification(expoPushToken, `إشعار جديد (${event_type})`, message, { screen: "chat", userId, messageId });

    return NextResponse.json({ success: true, id: notificationId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
