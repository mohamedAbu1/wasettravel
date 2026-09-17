import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    const { expoPushToken, title, bodyText } = body;
    if (!expoPushToken || !title || !bodyText) {
      return NextResponse.json({ success: false, error: "expoPushToken, title and bodyText are required" }, { status: 400 });
    }

    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body: bodyText,
      data: { screen: "chat" },
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    const result = await response.json();
    console.log("Expo Response:", result);
    if (!response.ok || result?.data?.status === "error") {
      return NextResponse.json({ success: false, error: result?.errors?.[0]?.message || result?.data?.message || "Push failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
