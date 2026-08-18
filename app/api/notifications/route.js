import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserToken } from "@/lib/notifications";

export async function POST(req) {
  try {
    const db = await connectDB();
    const body = await req.json();
    const id = uuidv4();

    // 🕒 توليد الوقت الحالي بالثانية
    const now = new Date();
    const createdAtSecond = now.toISOString().slice(0, 19).replace("T", " ");

    // ✅ تحقق من وجود إشعار بنفس المستخدم والحدث في نفس الثانية
  const [existing] = await db.execute(
  `SELECT id FROM notifications 
   WHERE event_type = ? AND user_id = ? AND message = ? 
   AND TIMESTAMPDIFF(SECOND, created_at, NOW()) < 60`,
  [body.event_type, body.user_id, body.message]
);

if (existing.length === 0) {
  await db.execute(
    `INSERT INTO notifications 
     (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, message_id, created_at, is_read) 
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
      body.message_id,
    ]
  );
}


    // 📱 إرسال إشعار للموبايل إذا فيه توكن
    const expoPushToken = await getUserToken(body.user_id);
    if (expoPushToken) {
      await fetch("https://wasettravel.com/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expoPushToken,
          title: `إشعار جديد (${body.event_type})`,
          bodyText: body.message,
        }),
      });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ جلب الإشعارات
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      `SELECT id, admin_id, event_type, user_id, message, message_id, user_name, user_email, user_image, created_at, is_read, trip_id 
       FROM notifications 
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ success: true, notifications: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
