"use server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";

export async function POST(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;
  try {
    const { userId, token } = await req.json();
    if (!userId || !token || String(userId) !== String(auth.user.id)) {
      return NextResponse.json({ success: false, error: "Invalid token owner" }, { status: 403 });
    }
    const db = await connectDB();

    // 🟢 إدخال أو تحديث الـ token (UPSERT)
    await db.query(
      `INSERT INTO push_tokens (id, user_id, token, created_at)
       VALUES (UUID(), ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         token = VALUES(token),
         created_at = NOW()`,
      [userId, token]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
