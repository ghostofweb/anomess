// pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

// If NextAuthOptions is not exported, derive it as follows:
type NextAuthOptions = Parameters<typeof NextAuth>[0];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Explicitly cast credentials to the expected shape
        const creds = credentials as { email: string; password: string };

        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: creds.email },
              { username: creds.email }, // Allow login with username too
            ],
          });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first.");
          }

          // Make sure both arguments to bcrypt.compare are strings.
          // Casting user.password to string if needed.
          const isPasswordCorrect = await bcrypt.compare(
            creds.password,
            user.password as string
          );

          if (isPasswordCorrect) {
            return {
              // Convert _id to a string (for example, if it is a Mongo ObjectId)
              _id: user._id,
              email: user.email,
              name: user.username,
              isVerified: user.isVerified,
              isAcceptingMessage: user.isAcceptingMessage,
              username: user.username,
            };
          } else {
            throw new Error("Incorrect password.");
          }
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Cast token properties to the expected types.
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Since user._id might be typed as unknown, cast it to string.
        token._id = (user as any)._id as string;
        token.isVerified = (user as any).isVerified;
        token.isAcceptingMessage = (user as any).isAcceptingMessage;
        token.username = (user as any).username;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
