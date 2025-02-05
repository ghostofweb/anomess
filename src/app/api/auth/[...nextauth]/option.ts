import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authHandler  = NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email }, // Allow login with username too
                        ],
                    });

                    if (!user) {
                        throw new Error("No user found with this email.");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account first.");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return {
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
                session.user._id = token._id as string  // Ensure TypeScript recognizes this
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified; // Fixed typo (was "isVarified")
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
});

