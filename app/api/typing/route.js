import { NextResponse } from "next/server";
import { isPrimaryAdmin, requireUser } from "@/lib/auth/admin";

let typingStatus = {}; // تخزين مؤقت في الذاكرة

export async function POST(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;
  const { userId, isTyping, adminTyping } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  if (!isPrimaryAdmin(auth.user) && String(userId) !== String(auth.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // تحديث حالة الكتابة للمستخدم أو الأدمن
  typingStatus[userId] = {
    isTyping: isTyping ?? typingStatus[userId]?.isTyping ?? false,
    adminTyping: adminTyping ?? typingStatus[userId]?.adminTyping ?? false,
  };

  return NextResponse.json({ success: true, userId, ...typingStatus[userId] });
}

export async function GET(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  if (!isPrimaryAdmin(auth.user) && String(userId) !== String(auth.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ userId, ...typingStatus[userId] });
}
