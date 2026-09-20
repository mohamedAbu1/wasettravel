import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { isPrimaryAdmin, requireUser, requireAdmin } from "@/lib/auth/admin";
import { notifyAdmins, notifyUser } from "@/lib/notifications";

export async function POST(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;

  try {
    const contentType = req.headers.get("content-type") || "";

    // 📌 لو الرسالة صورة
    if (contentType.includes("multipart/form-data")) {
      if (isPrimaryAdmin(auth.user)) {
        return NextResponse.json({ error: "Image messages are disabled for administrators" }, { status: 403 });
      }
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

      // اسم فريد للصورة
      const fileName = `${Date.now()}-${file.name}`;
      const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
      const baseUrl = `${siteOrigin}/iamges/${encodeURIComponent(fileName)}`;

      // مسار المشروع المحلي
      const projectPath = path.join(process.cwd(), "public/iamges", fileName);

      // تجهيز المجلدات
      await fs.promises.mkdir(path.dirname(projectPath), { recursive: true });

      // تحويل الملف إلى buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // حفظ نسخة في المشروع
      await fs.promises.writeFile(projectPath, buffer);

      // باقي البيانات
      const user_id = formData.get("user_id");
      if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

      const requestedSenderType = String(formData.get("sender_type") || "user").trim().toLowerCase();
      const sender_type = isPrimaryAdmin(auth.user) ? "admin" : "user";
      if (requestedSenderType !== sender_type) return NextResponse.json({ error: "Invalid sender type" }, { status: 403 });
      const user_name = formData.get("user_name") || "Admin";
      const user_image = formData.get("user_image") || "/default-avatar.png";
      const reply_to = formData.get("reply_to");
      const admin_id = sender_type === "admin" ? auth.user.id : null;
      if (sender_type === "user" && String(user_id) !== String(auth.user.id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

      const db = await connectDB();
      const messagesId = uuidv4();

      await db.query(
        `INSERT INTO messages 
         (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW())`,
        [messagesId, user_id, baseUrl, sender_type, user_name, user_image, reply_to ?? null, admin_id],
      );

      const newMessage = {
        id: messagesId,
        user_id,
        content: baseUrl,
        sender_type,
        user_name,
        user_image,
        reply_to,
        admin_id,
        status: "sent",
        created_at: new Date(),
      };

      if (sender_type === "user") {
        await notifyAdmins(db, { eventType: "message", message: contentType.includes("multipart") ? "New image message" : "New message", userId: auth.user.id, userName: auth.user.name || user_name, userEmail: auth.user.email, userImage: auth.user.avatar_url || user_image });
      }

      return NextResponse.json(newMessage, { status: 201 });
    }

    // 📌 لو الرسالة نصية
    const body = await req.json();
    const { user_id, content, sender_type = "user", user_name = "Unknown User", user_image = "/default-avatar.png", reply_to = null } = body;

    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    if (typeof content !== "string" || !content.trim()) return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });

    const isAdmin = isPrimaryAdmin(auth.user);
    const normalizedSenderType = String(sender_type).trim().toLowerCase();
    if (normalizedSenderType !== (isAdmin ? "admin" : "user")) return NextResponse.json({ error: "Invalid sender type" }, { status: 403 });
    if (!isAdmin && String(user_id) !== String(auth.user.id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const admin_id = isAdmin ? auth.user.id : null;

    const db = await connectDB();
    const messagesId = uuidv4();

    await db.query(
      `INSERT INTO messages 
       (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW())`,
      [messagesId, user_id, content.trim(), normalizedSenderType, user_name, user_image, reply_to, admin_id],
    );

    const newMessage = {
      id: messagesId,
      user_id,
      content,
        sender_type: normalizedSenderType,
      user_name,
      user_image,
      reply_to,
      admin_id,
      status: "sent",
      created_at: new Date(),
    };

    if (!isAdmin) {
      await notifyAdmins(db, { eventType: "message", message: content.slice(0, 180), userId: auth.user.id, userName: auth.user.name || user_name, userEmail: auth.user.email, userImage: auth.user.avatar_url || user_image });
    } else {
      await notifyUser(db, { userId: user_id, title: "📩 رسالة جديدة", message: content.slice(0, 180), data: { screen: "chat", userId: user_id } });
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error("❌ Error inserting message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const messageId = searchParams.get("messageId");

    const db = await connectDB();
    let query = `SELECT id, content, sender_type, created_at, user_name, user_image, reply_to, admin_id,user_id , status 
                 FROM messages`;
    let params = [];

    const isAdmin = isPrimaryAdmin(auth.user);
    if (messageId) {
      query += isAdmin ? ` WHERE id = ?` : ` WHERE id = ? AND user_id = ?`;
      params.push(messageId);
      if (!isAdmin) params.push(auth.user.id);
    } else if (userId) {
      query += ` WHERE user_id = ?`;
      params.push(isAdmin ? userId : auth.user.id);
    } else if (!isAdmin) {
      query += ` WHERE user_id = ?`;
      params.push(auth.user.id);
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
  const auth = requireUser(req);
  if (auth.response) return auth.response;

  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { messageId, status = "seen" } = body;
    if (!messageId) return NextResponse.json({ error: "messageId is required" }, { status: 400 });

    const db = await connectDB();
    const isAdmin = auth.user.role?.toLowerCase() === "admin";
    const [result] = await db.query(
      isAdmin
        ? `UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ?`
        : `UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ? AND user_id = ? AND sender_type = 'admin'`,
      isAdmin ? [status, messageId] : [status, messageId, auth.user.id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message updated successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error updating message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ حذف رسالة
export async function DELETE(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { messageId } = body;

    const db = await connectDB();
    const [result] = await db.query(`DELETE FROM messages WHERE id = ?`, [
      messageId,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message deleted successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error deleting message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
