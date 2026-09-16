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
  } catch (error) {
    // A notification failure must never make a message, review, or booking fail.
    console.error("Notification trigger failed:", error.message);
  }
}
