// file: app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // ✅ مسح الكوكيز الخاصة بالجلسة
    const response = NextResponse.json({ message: "Logged out successfully" });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    };
    ["token", "access-token", "refresh-token", "sb-access-token", "sb-refresh-token"].forEach((name) => {
      response.cookies.set(name, "", cookieOptions);
    });

    return response;
  } catch (err) {
    console.error("Logout Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
