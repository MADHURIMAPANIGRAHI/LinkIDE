// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
  // 1. Link the MongoDB database adapter
  adapter: MongoDBAdapter(clientPromise),

  // 2. Configure Authentication Providers
  providers: [
    // Google OAuth Strategy
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    // Passwordless Email Magic Link Strategy (Uses Resend under the hood)
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "smtp.resend.com",
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER || "resend",
          pass: process.env.EMAIL_SERVER_PASSWORD, // Your Resend API Key
        },
      },
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    }),
  ],

  // 3. Session Strategy
  session: {
    // Since we are using a database adapter, NextAuth defaults to 'database' sessions.
    // This securely stores session tokens right inside your MongoDB 'sessions' collection.
    strategy: "database", 
    maxAge: 60 * 60 * 2, // Sessions last for 2 hours
  },

  // 4. Custom Routing Callbacks
  callbacks: {
    async session({ session, user }) {
      // Inject the MongoDB user unique ID into the active frontend session object
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  // 5. Security Secret Encryption Key
  secret: process.env.NEXTAUTH_SECRET,
});

// NextAuth v5 requires exporting the handler for both GET and POST requests
export { handler as GET, handler as POST };