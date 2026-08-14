import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// ✅ جلب كل أسعار الصرف
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM currency_rates");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /currency Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ إضافة سعر جديد (POST)
export async function POST(req) {
  try {
    const { base_currency, target_currency, rate } = await req.json();

    if (!base_currency || !target_currency || !rate) {
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
      [base_currency, target_currency, rate]
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
  try {
    const { base_currency, target_currency, rate } = await req.json();

    if (!base_currency || !target_currency) {
      return NextResponse.json(
        { error: "Missing base_currency or target_currency" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    await db.query(
      `UPDATE currency_rates 
       SET rate = ?, updated_at = NOW() 
       WHERE base_currency = ? AND target_currency = ?`,
      [rate, base_currency, target_currency]
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
