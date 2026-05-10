import { createClient } from "@supabase/supabase-js";

export async function GET() {
  // ✅ Client عادي باستخدام anon key (لجداول مسموح بها عبر RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 1️⃣ جلب الحجوزات
  const { data: purchases, error: purchaseError } = await supabase
    .from("purchases")
    .select(`
      id,
      created_at,
      arrival_date,
      departure_date,
      guide_languages,
      num_children,
      num_persons,
      pet_type,
      platform,
      has_children,
      has_guide,
      status,
      has_pets,
      user_id,
      trip_id
    `);

  if (purchaseError) {
    return new Response(JSON.stringify({ error: purchaseError.message }), { status: 400 });
  }

  // 2️⃣ جلب الرحلات المرتبطة
  const tripIds = purchases.map((p) => p.trip_id);
  const { data: trips, error: tripError } = await supabase
    .from("trips")
    .select("id, title")
    .in("id", tripIds);

  if (tripError) {
    return new Response(JSON.stringify({ error: tripError.message }), { status: 400 });
  }

  // 3️⃣ جلب المستخدمين باستخدام service role
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ لازم يكون موجود في بيئة السيرفر فقط
  );

  const userIds = purchases.map((p) => p.user_id);

  // ✅ استخدم getUserById بدل listUsers(filter)
  const users = await Promise.all(
    userIds.map(async (id) => {
      const { data, error } = await adminClient.auth.admin.getUserById(id);
      if (error) {
        console.error("User fetch error:", error.message);
        return null;
      }
      return data;
    })
  );

  // 4️⃣ دمج البيانات
  const enrichedPurchases = purchases.map((p) => {
    const user = users.find((u) => u?.id === p.user_id);
    const trip = trips.find((t) => t.id === p.trip_id);

    return {
      ...p,
      userName: user?.user_metadata?.name || user?.email || "Unknown User",
      tripTitle: trip?.title?.en || "Unknown Trip",
    };
  });

  return new Response(JSON.stringify(enrichedPurchases), { status: 200 });
}
