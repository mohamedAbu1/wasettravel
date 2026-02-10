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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code مفقود" }, { status: 400 });

  const redirectUri = process.env.OAUTH_REDIRECT_URL;
  const token = await exchangeGoogleToken(code, redirectUri);
  if (!token.access_token) return NextResponse.json({ error: "فشل تبديل رمز جوجل" }, { status: 400 });

  const profile = await getGoogleUser(token.access_token);

  // upsert المستخدم
  const { data: users } = await supabaseAdmin
    .from("user")
    .upsert(
      {
        name: profile.name,
        email: profile.email,
        password: null,
        role: "USER",
        isActive: true,
        provider: "google",
        provider_id: profile.id,
        avatar_url: profile.picture,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "provider,provider_id" }
    )
    .select("id, name, email, role, isActive, provider, avatar_url");

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

  const { cookie } = await createSessionCookie(payload);
  const res = NextResponse.redirect("http://localhost:3000/");
  res.headers.set("Set-Cookie", cookie);
  return res;
}
