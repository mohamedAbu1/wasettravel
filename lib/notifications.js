import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function getUserToken(userId) {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT token FROM push_tokens WHERE user_id = ?",
    [userId]
  );
  if (rows.length === 0) return null;
  return rows[0].token;
}

export async function sendPushNotification(expoPushToken, title, body, data = {}) {
  if (!expoPushToken) return null;
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ to: expoPushToken, sound: "default", title, body, data }),
  });
  const result = await response.json();
  if (!response.ok || result?.data?.status === "error") {
    throw new Error(result?.errors?.[0]?.message || result?.data?.message || "Push notification failed");
  }
  return result;
}

export async function notifyUser(db, { userId, title, message, data = {} }) {
  try {
    const adminId = data.adminId || "00000000-0000-0000-0000-000000000000";
    const adminName = data.adminName || "WasetTravel";
    const adminImage = data.adminImage || "/HomePageImage/apple-touch-icon.png";
    const messageId = data.messageId || "00000000-0000-0000-0000-000000000000";
    await db.query(
      `INSERT INTO notifications
         (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, created_at, is_read, message_id)
         VALUES (?, ?, 'message', ?, ?, ?, ?, ?, ?, NOW(), 0, ?)`,
        [uuidv4(), adminId, String(message || title || "New message"), userId, adminName, "", adminImage, "00000000-0000-0000-0000-000000000000", messageId],
    );
    const [rows] = await db.query("SELECT token FROM push_tokens WHERE user_id = ?", [userId]);
    await Promise.all(rows.map((row) => sendPushNotification(row.token, title, message, data)));
  } catch (error) {
    console.error("User push notification failed:", error.message);
  }
}

export async function notifyAdmins(db, { eventType, message, userId = null, userName = null, userEmail = null, userImage = null, tripId = null, type = "in_app" }) {
  try {
    const [admins] = await db.query("SELECT id, email FROM users WHERE LOWER(TRIM(email)) = ? LIMIT 1", ["wasettraveleg@gmail.com"]);
    if (!admins.length) return;

    await Promise.all(admins.map((admin) => db.query(
      `INSERT INTO notifications
        (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, type, created_at, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`,
      [uuidv4(), admin.id, eventType, String(message || "New WasetTravel activity"), userId || "00000000-0000-0000-0000-000000000000", userName || "Traveler", userEmail || "", userImage || "/default-avatar.png", tripId || "00000000-0000-0000-0000-000000000000", type],
    )));

    const [tokens] = await db.query("SELECT token FROM push_tokens WHERE user_id IN (?)", [admins.map((admin) => admin.id)]);
    await Promise.all(tokens.map((row) => sendPushNotification(row.token, `إشعار جديد (${eventType})`, message, { eventType, tripId })));
  } catch (error) {
    // A notification failure must never make a message, review, or booking fail.
    console.error("Notification trigger failed:", error.message);
  }
}
