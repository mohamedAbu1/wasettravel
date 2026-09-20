import "dotenv/config";
import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";

const comments = [
  "A beautifully organized experience from start to finish. The itinerary was clear and the local guidance made the temples even more memorable.",
  "Excellent trip with thoughtful details, comfortable planning, and a very helpful team. I would happily book another WasetTravel journey.",
  "The route was enjoyable and well paced. Everything felt easy and professional, and the highlights were exactly what we hoped to see.",
];

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 5000,
});

try {
  const [trips] = await db.execute("SELECT id FROM trips ORDER BY created_at ASC LIMIT 1");
  const [users] = await db.execute(
    "SELECT id, name, email, avatar_url FROM users WHERE LOWER(email) <> ? ORDER BY created_at ASC LIMIT 3",
    ["wasettraveleg@gmail.com"],
  );

  if (!trips.length) throw new Error("No trip exists to receive the reviews");
  if (users.length < 3) throw new Error("At least three non-admin users are required");

  const tripId = trips[0].id;
  await db.beginTransaction();

  const reviewIds = [];
  const reviewOwners = [];
  for (let index = 0; index < users.length; index += 1) {
    const user = users[index];
    const [existing] = await db.execute(
      "SELECT id FROM reviews WHERE trip_id = ? AND user_id = ? AND comment = ? LIMIT 1",
      [tripId, user.id, comments[index]],
    );
    const reviewId = existing[0]?.id || randomUUID();
    if (!existing.length) {
      await db.execute(
        `INSERT INTO reviews
          (id, trip_id, user_id, rating, comment, name, avatar_url, time, created_at)
         VALUES (?, ?, ?, 5, ?, ?, ?, ?, NOW())`,
        [reviewId, tripId, user.id, comments[index], user.name || user.email, user.avatar_url || "/default-avatar.png", "5 stars"],
      );
    }
    reviewIds.push(reviewId);
    reviewOwners.push(user.id);
  }

  // Give every seeded review two likes from the other two users.
  for (let reviewIndex = 0; reviewIndex < reviewIds.length; reviewIndex += 1) {
    const reviewId = reviewIds[reviewIndex];
    for (const user of users) {
      if (String(user.id) === String(reviewOwners[reviewIndex])) continue;
      const [existingLike] = await db.execute(
        "SELECT review_id FROM review_likes WHERE review_id = ? AND user_id = ? LIMIT 1",
        [reviewId, user.id],
      );
      if (!existingLike.length) {
        await db.execute(
          "INSERT INTO review_likes (id, review_id, user_id, created_at) VALUES (?, ?, ?, NOW())",
          [randomUUID(), reviewId, user.id],
        );
      }
    }
  }

  await db.commit();
  console.log(`Seeded ${reviewIds.length} reviews and likes for trip ${tripId}`);
} catch (error) {
  try { await db.rollback(); } catch { /* Preserve the original error. */ }
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
