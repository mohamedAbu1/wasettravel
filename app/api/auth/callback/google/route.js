import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { maleAvatars, femaleAvatars } from "@/constants/images";

// دالة لاختيار صورة افتراضية
function getDefaultAvatar(gender) {
  let randomFile;
  if (gender?.toLowerCase() === "male") {
    randomFile = maleAvatars[Math.floor(Math.random() * maleAvatars.length)];
  } else if (gender?.toLowerCase() === "female") {
    randomFile = femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
  } else {
    randomFile = "default.webp";
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(randomFile);
  return data.publicUrl;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Error exchanging code:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { session, user } = data;

    // ✅ لو فيه صورة من جوجل نستخدمها، لو لأ نجيب افتراضية
    const googleAvatar =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null;

    const finalAvatar = googleAvatar || getDefaultAvatar(user.user_metadata?.gender);

    // ✅ upsert المستخدم في قاعدة البيانات
    const { error: upsertError } = await supabaseAdmin
      .from("users")
      .upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split("@")[0],
        avatar: finalAvatar,
        gender: user.user_metadata?.gender || "other",
        created_at: new Date().toISOString(),
      });

    if (upsertError) {
      console.error("Error upserting user:", upsertError.message);
    }

    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });
    response.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Callback Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
