import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
// جلب كل الريفيوهات
export async function GET() {
  const { data, error } = await supabase.from("reviews").select(`
      id,
      rating,
      comment,
      created_at,
      avatar_url,
      time,
      name,
      trips (id, title),
      users (id, name)
    `).order("created_at", { ascending: false }); // ✅ الأجدد أولاً;

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { trip_id, user_id, rating, comment, name, avatar_url, time } = body;
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          trip_id,
          user_id,
          rating,
          comment,
          name,
          avatar_url,
          time,
          created_at: new Date().toISOString(),
        },
      ])
      .select();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify(data[0]), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
