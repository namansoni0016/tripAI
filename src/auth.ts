import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "../data/user";

export const {handlers : { GET, POST }, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({ account }) {
            if(account?.provider !== "credentials") return true;
            return true;
        },
        async session({ token, session }) {
            if(token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token }) {
            if(!token.sub) return token;
            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;
            return token;
        }
    },
    ...authConfig
});