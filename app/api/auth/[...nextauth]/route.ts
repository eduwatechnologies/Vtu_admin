import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";

// Extend NextAuth types to include accessToken
declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          const { staff, token } = res.data;

          // Explicitly type the returned user object to include accessToken
          return {
            id: staff.id,
            name: staff.name,
            email: staff.email,
            role: staff.role,
            accessToken: token, // 👈 Add backend JWT here
          } as {
            id: string;
            name: string;
            email: string;
            role: string;
            accessToken: string;
          };
        } catch (error: any) {
          const message = error?.response?.data?.msg || "Login failed";
          console.error("Staff login failed:", message);
          throw new Error(message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken; // 👈 Save token to JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
      };
      session.accessToken = token.accessToken as string; // 👈 Add to session
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
