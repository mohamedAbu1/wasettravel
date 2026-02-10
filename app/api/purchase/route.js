import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/utils/JWToken"; // دالتك للتحقق من التوكين

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { tripId, hasChildren, hasPets, groupSize } = await req.json();

  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb_access")?.value;

  if (!access_token) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const payload = await verifySessionToken(access_token);
  if (!payload || !payload.id) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 401 });
  }

  const userId = payload.id;

  // تحقق إذا كان المستخدم اشترى الرحلة قبل كده
  const { data: existing } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("trip_id", tripId);

  if (existing && existing.length > 0) {
    return new Response(JSON.stringify({ error: "You already purchased this trip" }), { status: 400 });
  }

  // إضافة عملية شراء جديدة مع الحقول الإضافية
  const { error: insertError } = await supabase
    .from("purchases")
    .insert([{
      user_id: userId,
      trip_id: tripId,
      has_children: hasChildren,
      has_pets: hasPets,
      group_size: groupSize
    }]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: "Trip purchased successfully!" }), { status: 200 });
}
