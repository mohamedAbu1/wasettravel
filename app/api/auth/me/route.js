// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function GET() {
//   const token = cookies().get("my_token")?.value;
//   if (!token) {
//     return NextResponse.json({ error: "No token found" }, { status: 401 });
//   }

//   try {
//     // فك التوكين باستخدام الـ secret اللي انت عامل بيه التوقيع
//     const user = jwt.verify(token, process.env.JWT_SECRET);

//     return NextResponse.json({
//       id: user.id,
//       // email: user.email,
//       name: user.name,
//       avatar_url: user.avatar_url,
//     });
//   } catch (err) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
// }
