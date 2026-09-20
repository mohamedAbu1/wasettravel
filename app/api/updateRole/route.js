import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const { userId, newRole } = await req.json();
    const db = await connectDB();
    const [targetRows] = await db.query("SELECT email FROM users WHERE id = ? LIMIT 1", [userId]);
    if (!targetRows.length) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    const requestedRole = String(newRole || "").trim().toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
    const isPrimaryAdmin = String(targetRows[0].email || "").trim().toLowerCase() === "wasettraveleg@gmail.com";
    const role = isPrimaryAdmin ? "ADMIN" : requestedRole === "ADMIN" ? "USER" : "USER";

    // ✅ تحديث الدور في قاعدة البيانات
    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);

    // ✅ رجع استجابة واضحة
    return NextResponse.json(
      { success: true, role, userId },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating role:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
