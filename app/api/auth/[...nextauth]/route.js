import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const pool = await connectDB();

      const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

      const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [user.email]);
      const userId = rows.length > 0 ? rows[0].id : uuidv4();

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
          user.image || "default.webp",
          "other",
          role,
          new Date(),
        ]
      );

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const pool = await connectDB();
        const [rows] = await pool.query("SELECT role FROM users WHERE email = ?", [user.email]);
        token.role = rows.length > 0 ? rows[0].role : "USER";
      }
      return token;
    },

    async session({ session, token }) {
      const pool = await connectDB();
      const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [session.user.email]);

      session.user.id = rows.length > 0 ? rows[0].id : token.sub;
      session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
