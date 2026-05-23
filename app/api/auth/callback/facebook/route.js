// // app/api/auth/callback/facebook/route.js
// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// export async function GET(req) {
//   try {
//     // إنشاء عميل Supabase
//     const supabase = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL,
//       process.env.SUPABASE_SERVICE_ROLE_KEY
//     );

//     // استخراج الكود من الـ query
//     const { searchParams } = new URL(req.url);
//     const code = searchParams.get("code");

//     if (!code) {
//       return NextResponse.json({ error: "Missing code" }, { status: 400 });
//     }

//     // استبدال الكود بـ access_token من فيسبوك
//     const tokenRes = await fetch(
//       `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/facebook&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`
//     );

//     const tokenData = await tokenRes.json();

//     if (!tokenData.access_token) {
//       return NextResponse.json({ error: "Failed to get access token" }, { status: 400 });
//     }

//     // جلب بيانات المستخدم من فيسبوك
//     const userRes = await fetch(
//       `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`
//     );
//     const userData = await userRes.json();

//     if (!userData.email) {
//       return NextResponse.json({ error: "Email not returned from Facebook" }, { status: 400 });
//     }

//     // إدخال أو تحديث المستخدم في Supabase
//     const { data: user, error } = await supabase
//       .from("users")
//       .upsert({
//         provider: "facebook",
//         provider_id: userData.id,
//         name: userData.name,
//         email: userData.email,
//         avatar_url: userData.picture?.data?.url,
//       })
//       .select()
//       .single();

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     // إنشاء جلسة (اختياري: باستخدام JWT أو Supabase Auth)
//     // هنا مثال بسيط باستخدام كوكيز
//     const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`);
//     response.cookies.set("sb_access", tokenData.access_token, { httpOnly: true });
//     return response;

//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
