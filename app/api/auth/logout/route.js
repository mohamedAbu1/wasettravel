import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST() {
  try {
    // إنهاء الجلسة في Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // مسح الكوكيز
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("sb-access-token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("sb-refresh-token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error("Logout Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
