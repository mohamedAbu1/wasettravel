import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const baseUrl = `https://wasettravel.com/iamges/${fileName}`; // ✅ رابط الصورة النهائي

    // مسار الحفظ على السيرفر
    const uploadPath = `/home/u984684626/public_html/iamges/${fileName}`;

    // تأكد أن الفولدر موجود
    await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });

    // حفظ الملف فعليًا
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(uploadPath, buffer);

    // باقي البيانات
    const user_id = formData.get("user_id");
    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const sender_type = formData.get("sender_type") || "user";
    const user_name = formData.get("user_name") || "Unknown User";
    const user_image = formData.get("user_image") || "/default-avatar.png";

    const db = await connectDB();
    const messagesId = uuidv4();

    // تخزين الرابط في قاعدة البيانات
    await db.query(
      `INSERT INTO messages (id, user_id, content, sender_type, user_name, user_image, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, 'sent', NOW())`,
      [messagesId, user_id, baseUrl, sender_type, user_name, user_image]
    );

    return NextResponse.json(
      { id: messagesId, url: baseUrl, message: "Image uploaded successfully!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error uploading image:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ جلب جميع الرسائل أو رسائل مستخدم محدد
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const messageId = searchParams.get("messageId");

    const db = await connectDB();
    let query = `SELECT id, content, sender_type, created_at, user_name, user_image, reply_to, admin_id, status 
                 FROM messages`;
    let params = [];

    if (messageId) {
      query += ` WHERE id = ?`;
      params.push(messageId);
    } else if (userId) {
      query += ` WHERE user_id = ?`;
      params.push(userId);
    }

    query += ` ORDER BY created_at ASC`;

    const [rows] = await db.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ تحديث حالة الرسالة
export async function PUT(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid or empty JSON body" }, { status: 400 });
    }

    const { messageId, status = "seen" } = body;

    const db = await connectDB();
    const [result] = await db.query(
      `UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, messageId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message updated successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ حذف رسالة
export async function DELETE(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid or empty JSON body" }, { status: 400 });
    }

    const { messageId } = body;

    const db = await connectDB();
    const [result] = await db.query(`DELETE FROM messages WHERE id = ?`, [messageId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message deleted successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error deleting message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
