import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { isPrimaryAdmin, requireUser, requireAdmin } from "@/lib/auth/admin";
import { notifyAdmins, notifyUser } from "@/lib/notifications";
import { siteConfig } from "@/lib/siteConfig";

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
      const user_id = formData.get("user_id");
      if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
      const sender_type = isPrimaryAdmin(auth.user) ? "admin" : "user";
      if (sender_type === "user" && String(user_id) !== String(auth.user.id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      const requestedSenderType = String(formData.get("sender_type") || "user").trim().toLowerCase();
      if (requestedSenderType !== sender_type) return NextResponse.json({ error: "Invalid sender type" }, { status: 403 });
      if (typeof file.type === "string" && !file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
      if (Number(file.size || 0) > 8 * 1024 * 1024) return NextResponse.json({ error: "Image must be smaller than 8 MB" }, { status: 413 });

      // اسم فريد للصورة
      const safeFileName = path.basename(String(file.name || "upload")).replace(/[^a-zA-Z0-9._-]/g, "-");
      const fileName = `${Date.now()}-${safeFileName}`;
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
      const requestedUserName = formData.get("user_name");
      const requestedUserImage = formData.get("user_image");
      const user_name = sender_type === "admin" ? siteConfig.name : auth.user.name || requestedUserName || "Unknown User";
      const user_image = sender_type === "admin" ? siteConfig.brandImage : auth.user.avatar_url || requestedUserImage || "/default-avatar.png";
      const reply_to = formData.get("reply_to");
      const admin_id = sender_type === "admin" ? auth.user.id : null;

      const db = await connectDB();
      const messagesId = uuidv4();

      await db.query(
        `INSERT INTO messages 
         (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW(), NOW())`,
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
        await notifyAdmins(db, { eventType: "message", message: "New image message", messageId: messagesId, userId: auth.user.id, userName: auth.user.name || user_name, userEmail: auth.user.email, userImage: auth.user.avatar_url || user_image });
      }

      return NextResponse.json(newMessage, { status: 201 });
    }

    // 📌 لو الرسالة نصية
    const body = await req.json();
    const { user_id, content, sender_type = "user", user_name: requestedUserName = "Unknown User", user_image: requestedUserImage = "/default-avatar.png", reply_to = null } = body;

    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    if (typeof content !== "string" || !content.trim()) return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });

    const isAdmin = isPrimaryAdmin(auth.user);
    const normalizedSenderType = String(sender_type).trim().toLowerCase();
    if (normalizedSenderType !== (isAdmin ? "admin" : "user")) return NextResponse.json({ error: "Invalid sender type" }, { status: 403 });
    if (!isAdmin && String(user_id) !== String(auth.user.id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const admin_id = isAdmin ? auth.user.id : null;
    const user_name = isAdmin ? siteConfig.name : auth.user.name || requestedUserName || "Unknown User";
    const user_image = isAdmin ? siteConfig.brandImage : auth.user.avatar_url || requestedUserImage || "/default-avatar.png";

    const db = await connectDB();
    const messagesId = uuidv4();

    await db.query(
      `INSERT INTO messages 
       (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW(), NOW())`,
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
      await notifyAdmins(db, { eventType: "message", message: content.slice(0, 180), messageId: messagesId, userId: auth.user.id, userName: auth.user.name || user_name, userEmail: auth.user.email, userImage: auth.user.avatar_url || user_image });
    } else {
      await notifyUser(db, {
        userId: user_id,
        title: "📩 رسالة جديدة",
        message: content.slice(0, 180),
        data: { screen: "chat", userId: user_id, messageId: messagesId, adminId: auth.user.id, adminName: siteConfig.name, adminImage: siteConfig.brandImage },
      });
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
    const isAdmin = isPrimaryAdmin(auth.user);
    if (!["sent", "seen"].includes(String(status).toLowerCase())) return NextResponse.json({ error: "Invalid message status" }, { status: 400 });
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
    if (!messageId) return NextResponse.json({ error: "messageId is required" }, { status: 400 });

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
