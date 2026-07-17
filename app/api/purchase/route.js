import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const {
      tripId,
      numPersons,
      hasChildren,
      numChildren,
      hasPets,
      petTypes,
      hasGuide,
      selectedLanguages,
      arrivalDate,
      userId,
      status,
      departureDate,
      platform,
    } = await req.json();

    const db = await connectDB();


    // ✅ تحقق إذا كان فيه حجز سابق
    const [existing] = await db.query(
      "SELECT * FROM purchases WHERE user_id = ? AND trip_id = ?",
      [userId, tripId]
    );

    if (existing.length > 0) {
      const oldPurchase = existing[0];

      if (oldPurchase.status === "Cancelled") {
        const purchaseId = uuidv4();


        await db.query(
          `INSERT INTO purchases 
            (id, user_id, trip_id, num_persons, has_children, num_children, has_pets, pet_type, 
             has_guide, guide_languages, arrival_date, departure_date, platform, status, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            purchaseId,
            userId,
            tripId,
            numPersons,
            hasChildren,
            numChildren,
            hasPets,
            JSON.stringify(petTypes),          // ✅ تخزين الحيوانات كـ JSON
            hasGuide,
            JSON.stringify(selectedLanguages), // ✅ تخزين اللغات كـ JSON
            arrivalDate,
            departureDate,
            platform,
            status,
          ]
        );

        return NextResponse.json(
          { message: "Trip re-purchased successfully!" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "You already purchased this trip" },
        { status: 400 }
      );
    }

    // ✅ إضافة عملية شراء جديدة لو مفيش أي حجز سابق
    const purchaseId = uuidv4();

    await db.query(
      `INSERT INTO purchases 
        (id, user_id, trip_id, num_persons, has_children, num_children, has_pets, pet_type, 
         has_guide, guide_languages, arrival_date, departure_date, platform, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        purchaseId,
        userId,
        tripId,
        numPersons,
        hasChildren,
        numChildren,
        hasPets,
        JSON.stringify(petTypes),          // ✅ تخزين الحيوانات كـ JSON
        hasGuide,
        JSON.stringify(selectedLanguages), // ✅ تخزين اللغات كـ JSON
        arrivalDate,
        departureDate,
        platform,
        status,
      ]
    );

    return NextResponse.json(
      { message: "Trip purchased successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error in purchase:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
