import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase.from("users").select(`
        id,
        name,
        email,
        avatar_url,
        role,
        reviews (
  id,
  rating,
  comment,
  created_at,
  user_id ( id, name, email ),
  trip_id ( id, title )
)

        )
      `);

    if (error) {
      console.error("❌ Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }

    console.log("📡 Users with reviews:", data);
    return NextResponse.json({ success: true, users: data }, { status: 200 });
  } catch (err) {
    console.error("❌ Exception:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
