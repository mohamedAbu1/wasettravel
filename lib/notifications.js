import { connectDB } from "@/lib/db";

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
    const [rows] = await db.query("SELECT token FROM push_tokens WHERE user_id = ?", [userId]);
    await Promise.all(rows.map((row) => sendPushNotification(row.token, title, message, data)));
  } catch (error) {
    console.error("User push notification failed:", error.message);
  }
}

export async function notifyAdmins(db, { eventType, message, userId = null, userName = null, userEmail = null, userImage = null, tripId = null, type = "in_app" }) {
  try {
    const [admins] = await db.query("SELECT id FROM users WHERE LOWER(role) = 'admin'");
    if (!admins.length) return;

    await Promise.all(admins.map((admin) => db.query(
      `INSERT INTO notifications
        (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, type, created_at, is_read)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`,
      [admin.id, eventType, message, userId, userName, userEmail, userImage, tripId, type],
    )));

    const [tokens] = await db.query("SELECT token FROM push_tokens WHERE user_id IN (?)", [admins.map((admin) => admin.id)]);
    await Promise.all(tokens.map((row) => sendPushNotification(row.token, `إشعار جديد (${eventType})`, message, { eventType, tripId })));
  } catch (error) {
    // A notification failure must never make a message, review, or booking fail.
    console.error("Notification trigger failed:", error.message);
  }
}
