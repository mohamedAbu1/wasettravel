import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

// ✅ جلب كل أسعار الصرف
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT id, base_currency, target_currency, rate, updated_at FROM currency_rates WHERE base_currency IN ('USD','EUR','EGP') AND target_currency IN ('USD','EUR','EGP') ORDER BY base_currency, target_currency");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /currency Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ إضافة سعر جديد (POST)
export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const { base_currency, target_currency, rate } = await req.json();
    const base = String(base_currency || "").toUpperCase();
    const target = String(target_currency || "").toUpperCase();
    const numericRate = Number(rate);

    if (!["USD", "EUR", "EGP"].includes(base) || !["USD", "EUR", "EGP"].includes(target) || base === target || !Number.isFinite(numericRate) || numericRate <= 0 || numericRate > 100000) {
      return NextResponse.json(
        { error: "Missing base_currency, target_currency or rate" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    await db.query(
      `INSERT INTO currency_rates (base_currency, target_currency, rate, updated_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE rate = VALUES(rate), updated_at = NOW()`,
      [base, target, numericRate]
    );

    return NextResponse.json(
      { message: "Rate added or updated successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /currency Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ✅ تعديل سعر موجود (PUT)
export async function PUT(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const { base_currency, target_currency, rate } = await req.json();
    const base = String(base_currency || "").toUpperCase();
    const target = String(target_currency || "").toUpperCase();
    const numericRate = Number(rate);

    if (!["USD", "EUR", "EGP"].includes(base) || !["USD", "EUR", "EGP"].includes(target) || base === target || !Number.isFinite(numericRate) || numericRate <= 0 || numericRate > 100000) {
      return NextResponse.json(
        { error: "Missing base_currency or target_currency" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    await db.query(
      `INSERT INTO currency_rates (base_currency, target_currency, rate, updated_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE rate = VALUES(rate), updated_at = NOW()`,
      [base, target, numericRate]
    );

    return NextResponse.json(
      { message: "Rate updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /currency Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
