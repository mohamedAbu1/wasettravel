import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    await db.query("SELECT 1 AS ok");
    return Response.json(
      { status: "ok", database: "ok", timestamp: new Date().toISOString() },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Health check failed:", error.message);
    return Response.json(
      { status: "degraded", database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
