import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { notifyAdmins } from "@/lib/notifications";
import { requireUser } from "@/lib/auth/admin";
import { z } from "zod";

const purchaseSchema = z.object({
  tripId: z.string().uuid(),
  numPersons: z.coerce.number().int().min(1).max(50).default(1),
  hasChildren: z.boolean().default(false),
  numChildren: z.coerce.number().int().min(0).max(20).default(0),
  hasPets: z.boolean().default(false),
  petTypes: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  hasGuide: z.boolean().default(false),
  selectedLanguages: z.array(z.string().trim().min(2).max(20)).max(10).default([]),
  arrivalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  platform: z.enum(["web", "mobile", "whatsapp"]).default("web"),
});

export async function POST(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;
  try {
    const parsed = purchaseSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the booking details" }, { status: 400 });
    }
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
      departureDate,
      platform,
    } = parsed.data;
    if (arrivalDate && departureDate && departureDate < arrivalDate) {
      return NextResponse.json({ error: "Departure date must be after arrival date" }, { status: 400 });
    }
    const userId = auth.user.id;
    const user_name = String(auth.user.name || auth.user.email || "Traveler").slice(0, 120);
    const user_email = String(auth.user.email || "").slice(0, 255);
    const user_image = String(auth.user.avatar_url || auth.user.image || "").slice(0, 1000) || null;
    const bookingStatus = "Pending";

    const db = await connectDB();
    const [trips] = await db.query("SELECT id FROM trips WHERE id = ? LIMIT 1", [tripId]);
    if (!trips.length) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // ✅ Check if there is an existing purchase
    const [existing] = await db.query(
      "SELECT * FROM purchases WHERE user_id = ? AND trip_id = ?",
      [userId, tripId],
    );

    if (existing.length > 0) {
      const oldPurchase = existing[0];

      if (oldPurchase.status === "Cancelled") {
        const purchaseId = uuidv4();

        await db.query(
          `INSERT INTO purchases 
            (id, user_id, trip_id, user_name, user_email, user_image, num_persons, has_children, num_children, has_pets, pet_type, 
             has_guide, guide_languages, arrival_date, departure_date, platform, status, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            purchaseId,
            userId,
            tripId,
            user_name,                // ✅ correct position
            user_email,               // ✅ correct position
            user_image,               // ✅ correct position
            numPersons,
            hasChildren,
            numChildren,
            hasPets,
            JSON.stringify(petTypes),
            hasGuide,
            JSON.stringify(selectedLanguages),
            arrivalDate,
            departureDate,
            platform,
            bookingStatus,
          ],
        );

        await notifyAdmins(db, { eventType: "purchase", message: `${user_name || "A customer"} requested a trip booking`, userId, userName: user_name, userEmail: user_email, userImage: user_image, tripId });

        return NextResponse.json(
          { message: "Trip re-purchased successfully!" },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { error: "You already purchased this trip" },
        { status: 400 },
      );
    }

    // ✅ Add a new purchase if none exists
    const purchaseId = uuidv4();

    await db.query(
      `INSERT INTO purchases 
        (id, user_id, trip_id, user_name, user_email, user_image, num_persons, has_children, num_children, has_pets, pet_type, 
         has_guide, guide_languages, arrival_date, departure_date, platform, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        purchaseId,
        userId,
        tripId,
        user_name,                // ✅ correct position
        user_email,               // ✅ correct position
        user_image,               // ✅ correct position
        numPersons,
        hasChildren,
        numChildren,
        hasPets,
        JSON.stringify(petTypes),
        hasGuide,
        JSON.stringify(selectedLanguages),
        arrivalDate,
        departureDate,
        platform,
        bookingStatus,
      ],
    );

    await notifyAdmins(db, { eventType: "purchase", message: `${user_name || "A customer"} requested a trip booking`, userId, userName: user_name, userEmail: user_email, userImage: user_image, tripId });

    return NextResponse.json(
      { message: "Trip purchased successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error in purchase:", err);
    return NextResponse.json({ error: "Unable to create the booking right now" }, { status: 500 });
  }
}
