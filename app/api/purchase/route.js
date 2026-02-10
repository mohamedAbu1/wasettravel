import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/utils/JWToken"; // دالتك للتحقق من التوكين

export async function POST(req) {
  console.log("📌 [API] Purchase route called");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  console.log("✅ Supabase client created");

  const { tripId } = await req.json();
  console.log("📌 Trip ID received:", tripId);

  // جلب التوكين من الكوكيز
  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb_access")?.value;
  console.log("📌 Access token from cookies:", access_token);

  if (!access_token) {
    console.error("❌ No access token found");
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  // تحقق من التوكين باستخدام دالتك
  const payload = await verifySessionToken(access_token);
  console.log("📌 Token payload:", payload);

  if (!payload || !payload.id) {
    console.error("❌ Invalid token or user not found");
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
    });
  }

  const userId = payload.id;

  // تحقق إذا كان المستخدم اشترى الرحلة قبل كده
  const { data: existing, error: existingError } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("trip_id", tripId);

  console.log("📌 Existing purchases:", existing, "Error:", existingError);

  if (existing && existing.length > 0) {
    console.warn("⚠️ User already purchased this trip");
    return new Response(
      JSON.stringify({ error: "You already purchased this trip" }),
      { status: 400 }
    );
  }

  // إضافة عملية شراء جديدة
  const { error: insertError } = await supabase
    .from("purchases")
    .insert([{ user_id: userId, trip_id: tripId }]);

  console.log("📌 Insert result error:", insertError);

  if (insertError) {
    console.error("❌ Insert failed:", insertError.message);
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 400,
    });
  }

  console.log("✅ Trip purchased successfully!");
  return new Response(
    JSON.stringify({ message: "Trip purchased successfully!" }),
    { status: 200 }
  );
}
