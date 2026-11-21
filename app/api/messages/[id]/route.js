import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

// ✅ جلب رسالة واحدة بالـ id
export async function GET(req, { params }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const { id } = params;
    const db = await connectDB();

    const [rows] = await db.query("SELECT * FROM messages WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to load the message right now" }, { status: 503 });
  }
}

// ✅ تحديث حالة الرسالة بالـ id
export async function PUT(req, { params }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const { id } = params;
    const { status = "seen" } = await req.json();
    const normalizedStatus = String(status).toLowerCase();
    if (!["sent", "seen"].includes(normalizedStatus)) {
      return NextResponse.json({ error: "Invalid message status" }, { status: 400 });
    }

    const db = await connectDB();
    const [result] = await db.query(
      "UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ?",
      [normalizedStatus, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message updated successfully!" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to update the message right now" }, { status: 500 });
  }
}

// ✅ حذف رسالة بالـ id
export async function DELETE(req, { params }) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const { id } = params;
    const db = await connectDB();

    const [result] = await db.query("DELETE FROM messages WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully!" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to delete the message right now" }, { status: 500 });
  }
}
