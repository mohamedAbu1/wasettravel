// file: app/api/trips/route.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. إنشاء الرحلة
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert({
        title: body.title,
        description: body.description,
        price: body.price,
        currency: body.currency,
        duration: body.duration,
        duration_unit: body.duration_unit,
        cover_image: body.cover_image,
        gallery_images: body.gallery_images,
      })
      .select()
      .single();

    if (tripError) throw tripError;

    // 2. ربط المدن
    if (body.cities?.length) {
      for (const rawCityName of body.cities) {
        const cityName = (rawCityName ?? "").trim();
        if (!cityName) continue;

        const { data: city, error: cityLookupErr } = await supabase
          .from("cities")
          .select("id, name")
          .eq("name", cityName)
          .single();

        if (cityLookupErr) {
          console.error(
            "City lookup error:",
            cityLookupErr,
            "for name:",
            cityName
          );
          continue;
        }
        if (!city) {
          console.warn("City not found, skipping:", cityName);
          continue;
        }

        const { error: linkErr } = await supabase.from("trip_cities").insert({
          trip_id: trip.id,
          city_id: city.id,
        });

        if (linkErr) {
          console.error("Trip_Cities insert error:", linkErr, {
            trip_id: trip.id,
            city_id: city.id,
          });
        } else {
          console.log(`Linked city ${cityName} to trip ${trip.id}`);
        }
      }
    }

    // 3. ربط التصنيفات
    if (body.categories?.length) {
      for (const rawCatName of body.categories) {
        const catName = (rawCatName ?? "").trim();
        if (!catName) continue;

        const { data: category, error: catLookupErr } = await supabase
          .from("categories")
          .select("id, name")
          .eq("name", catName)
          .single();

        if (catLookupErr) {
          console.error(
            "Category lookup error:",
            catLookupErr,
            "for name:",
            catName
          );
          continue;
        }
        if (!category) {
          console.warn("Category not found, skipping:", catName);
          continue;
        }

        const { error: linkErr } = await supabase
          .from("trip_categories")
          .insert({
            trip_id: trip.id,
            category_id: category.id,
          });

        if (linkErr) {
          console.error("Trip_Categories insert error:", linkErr, {
            trip_id: trip.id,
            category_id: category.id,
          });
        } else {
          console.log(`Linked category ${catName} to trip ${trip.id}`);
        }
      }
    }

    // 4. إدخال الـ Includes
    if (body.includes?.length) {
      for (const inc of body.includes) {
        const { error: incErr } = await supabase.from("Includes").insert({
          trip_id: trip.id,
          include_translations: inc, // {en:"Hotel", es:"Hotel", ...}
        });
        if (incErr) {
          console.error("Includes insert error:", incErr);
        } else {
          console.log("Include added:", inc);
        }
      }
    }

    // 5. إدخال الـ Itinerary (Days + Activities)
    if (body.itinerary?.length) {
      for (const day of body.itinerary) {
        // إدخال اليوم في جدول trip_days
        const { data: tripDay, error: dayError } = await supabase
          .from("Trip_Days")
          .insert({
            trip_id: trip.id,
            day_number: day.day,
          })
          .select()
          .single();

        if (dayError) {
          console.error("Trip_Days insert error:", dayError);
          throw dayError;
        }
        console.log("Day added:", tripDay);

        // إدخال الأنشطة المرتبطة باليوم في جدول day_activities
        if (day.activities?.length) {
          for (const act of day.activities) {
            const { error: actErr } = await supabase
              .from("Day_Activities")
              .insert({
                day_id: tripDay.id,
                time: act.time,
                activity_translations: act.activity, // {en:"Visit museum", es:"Visitar museo", ...}
              });
            if (actErr) {
              console.error("Day_Activities insert error:", actErr);
            } else {
              console.log("Activity added:", act);
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, trip }), {
      status: 201,
    });
  } catch (err) {
    console.error("API Error:", err); // يطبع الخطأ في السيرفر
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const { data: trips, error } = await supabase
      .from("trips")
      .select(`
        id,
        title,
        description,
        price,
        currency,
        duration,
        duration_unit,
        priceLevel,
        cover_image,
        gallery_images,
        trip_cities (
          city_id,
          cities ( id, name )
        ),
        trip_categories (
          category_id,
          categories ( id, name )
        ),
        Includes (
          id,
          include_translations
        ),
         Trip_Days (
          id,
          day_number,
          Day_Activities (
            id,
            time,
            activity_translations
          )
        )
      `);

    if (error) throw error;
    return new Response(JSON.stringify({ success: true, trips }), { status: 200 });
  } catch (err) {
    console.error("GET /api/trips error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

