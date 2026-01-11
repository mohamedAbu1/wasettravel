// file: app/api/cities/route.js
import { supabase } from "@/lib/supabaseClient";


export async function GET() {
  try {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, cities: data }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}
