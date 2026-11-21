import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/siteConfig";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(4000),
});

const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getClientKey(req) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}

function isRateLimited(key) {
  const now = Date.now();
  const current = rateLimit.get(key);
  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW) {
    rateLimit.set(key, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

export async function POST(req) {
  try {
    if (isRateLimited(getClientKey(req))) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Please check the form fields and try again." }, { status: 400 });
    }
    const { name, phone, email, message } = parsed.data;
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json({ success: false, error: "Contact service is temporarily unavailable." }, { status: 503 });
    }
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "wasettravel@outlook.com" }],
            subject: `New Contact Form Submission from ${name.replace(/[\r\n]/g, " ")}`,
          },
        ],
        from: { email: siteConfig.email },
        content: [
          {
            type: "text/html",
            value: `
              <html>
                <body style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
                  <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.1); padding:30px;">
                    <h2 style="color:#0066cc; text-align:center;">📩 New Contact Form Submission</h2>
                    <p><strong>👤 Name:</strong> ${safeName}</p>
                    <p><strong>📞 Phone:</strong> ${safePhone}</p>
                    <p><strong>✉️ Email:</strong> ${safeEmail}</p>
                    <p><strong>📝 Message:</strong></p>
                    <div style="background:#f9f9f9; border-left:4px solid #0066cc; padding:15px; border-radius:6px;">
                      ${safeMessage}
                    </div>
                    <hr />
                    <p style="font-size:12px; color:#888; text-align:center;">
                      ✨ This message was sent via WASET Travel Contact Form ✨
                    </p>
                  </div>
                </body>
              </html>
            `,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Error sending email:", errorText);
      return NextResponse.json({ success: false, error: "Unable to send your message right now." }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: "✅ Email sent successfully" });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ success: false, error: "Contact service is temporarily unavailable." }, { status: 503 });
  }
}
