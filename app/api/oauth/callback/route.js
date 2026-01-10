// app/api/auth/oauth/callback/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { createSessionCookie } from "@/lib/utils/JWToken";

async function exchangeGoogleToken(code, redirectUri) {
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  return resp.json();
}

async function getGoogleUser(accessToken) {
  const resp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return resp.json();
}

async function exchangeFacebookToken(code, redirectUri) {
  const tokenUrl = new URL("https://graph.facebook.com/v17.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", process.env.FACEBOOK_CLIENT_ID);
  tokenUrl.searchParams.set("client_secret", process.env.FACEBOOK_CLIENT_SECRET);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);
  const resp = await fetch(tokenUrl);
  return resp.json();
}

async function getFacebookUser(accessToken) {
  const url = new URL("https://graph.facebook.com/me");
  url.searchParams.set("fields", "id,name,email,picture");
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  return resp.json();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // اختياري للتحقق
    const error = searchParams.get("error");

    if (error) return NextResponse.json({ error }, { status: 400 });
    if (!code) return NextResponse.json({ error: "code مفقود" }, { status: 400 });

    // نحدد المزود من الـ referer أو من state (يمكنك تضمينه في state)
    const referer = request.headers.get("referer") ?? "";
    const provider = referer.includes("/google") ? "google" : referer.includes("/facebook") ? "facebook" : null;
    if (!provider) return NextResponse.json({ error: "مزود غير معروف" }, { status: 400 });

    const redirectUri = process.env.OAUTH_REDIRECT_URL;
    let profile;

    if (provider === "google") {
      const token = await exchangeGoogleToken(code, redirectUri);
      if (!token.access_token) return NextResponse.json({ error: "فشل تبديل رمز جوجل" }, { status: 400 });
      profile = await getGoogleUser(token.access_token);
      // profile: { id, email, name, picture, ... }
    } else {
      const token = await exchangeFacebookToken(code, redirectUri);
      if (!token.access_token) return NextResponse.json({ error: "فشل تبديل رمز فيسبوك" }, { status: 400 });
      profile = await getFacebookUser(token.access_token);
      // profile: { id, name, email, picture: { data: { url } } }
    }

    const email = profile.email ?? null;
    const name = profile.name ?? "";
    const avatar =
      provider === "google" ? profile.picture : profile?.picture?.data?.url ?? null;

    // upsert المستخدم بناءً على provider + provider_id
    const { data: users, error: upsertError } = await supabaseAdmin
      .from("user")
      .upsert(
        {
          name,
          email,
          password: null, // OAuth
          role: "USER",
          isActive: true,
          provider: provider,
          provider_id: profile.id,
          avatar_url: avatar,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider,provider_id" }
      )
      .select("id, name, email, role, isActive, provider, avatar_url");

    if (upsertError || !users?.[0]) {
      return NextResponse.json({ error: "فشل حفظ المستخدم" }, { status: 500 });
    }

    const user = users[0];

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      provider: user.provider,
      avatar_url: user.avatar_url,
    };

    const cookie = createSessionCookie(payload);

    // يمكنك إعادة التوجيه لواجهة المستخدم بعد إتمام الجلسة
    const res = NextResponse.redirect("http://localhost:3000/");
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch {
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
