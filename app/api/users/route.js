import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const db = await connectDB();

    // ✅ استعلام كل المستخدمين
    const [rows] = await db.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.avatar_url,
        u.created_at,
        (SELECT COUNT(*) FROM review_likes rl WHERE rl.user_id = u.id) AS likes_count,
        (SELECT COUNT(*) FROM reviews r WHERE r.user_id = u.id) AS comments_count,
        COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.user_id = u.id), 0) AS average_rating
      FROM users u
      ORDER BY u.created_at DESC
    `);

    const users = rows.map((user) => ({
      ...user,
      likes_count: Number(user.likes_count || 0),
      comments_count: Number(user.comments_count || 0),
      average_rating: Number(Number(user.average_rating || 0).toFixed(1)),
    }));

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
