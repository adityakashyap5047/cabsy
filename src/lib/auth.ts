import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Missing email or password");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (!user) {
                        throw new Error("No user found");
                    }

                    if (!user.password || user.isGuest) {
                        throw new Error("Unauthorized!!! Please register to login.");
                    }

                    const isMatched = await bcrypt.compare(credentials.password, user.password);

                    if (!isMatched) {
                        throw new Error("Wrong Password!!!, Password didn't match");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`
                    };
                } catch (error) {
                    throw error;
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};