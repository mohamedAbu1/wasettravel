import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const pool = await connectDB();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // ✅ قائمة الإيميلات اللي تعتبر Admin
      const adminEmails = [
        "wasettraveleg@gmail.com",
        "mohamedahmed33m11@gmail.com",
      ];

      // تحقق من وجود المستخدم أو أنشئه
      const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [user.email]);
      const userId = rows.length > 0 ? rows[0].id : uuidv4();

      // ✅ تحديد الدور بناءً على الإيميل
      const role = adminEmails.includes(user.email) ? "ADMIN" : "USER";

      await pool.query(
        `INSERT INTO users (id, email, name, avatar_url, gender, role, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           avatar_url = VALUES(avatar_url),
           role = VALUES(role)`,
        [
          userId,
          user.email,
          user.name || user.email.split("@")[0],
          user.image || "default.webp", // ✅ الصورة من جوجل
          "other",
          role,
          new Date(),
        ]
      );

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // ✅ اجلب الدور الحقيقي من قاعدة البيانات
        const [rows] = await pool.query("SELECT role FROM users WHERE email = ?", [user.email]);
        token.role = rows.length > 0 ? rows[0].role : "USER";
      }
      return token;
    },

    async session({ session, token }) {
      // ✅ اجلب الـ id من قاعدة البيانات
      const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [session.user.email]);

      if (rows.length > 0) {
        session.user.id = rows[0].id; // UUID من قاعدة البيانات
      } else {
        session.user.id = token.sub; // fallback
      }

      session.user.role = token.role; // ✅ الدور من الـ JWT
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };