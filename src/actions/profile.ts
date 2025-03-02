"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getProfileById(userId: string) {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image:true,
                createdAt: true,
                _count: {
                    select: {
                        queries: true,
                    },
                },
                accounts: {
                    select: {
                        provider: true,
                    },
                },
            },
        });
        return user ? {...user, provider: user.accounts.length > 0 ? user.accounts[0].provider: "credentials"} : null;
    } catch (error) {
        console.log("Error fetching profile: ", error);
        throw new Error("Failed to fetch profile");
    }
}

export async function getSavedQueries(userId: string) {
    try {
        const queries = await db.query.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                created: "desc"
            }
        });
        return queries;
    } catch (error) {
        console.log("Error fetching saved trips: ", error);
        throw new Error("Failed to fetch saved trips")
    }
}

export async function updateProfile(formData: FormData) {
    try {
        const session = await auth();
        if(!session || !session.user) {
            throw new Error("Unauthorized");
        }
        const userId = session.user.id;
        if(!userId) {
            throw new Error("User ID not found!");
        }
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const updateData: { name: string; email: string; password?: string } = {name, email};
        if(password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const user = await db.user.update({
            where: { id: userId },
            data: updateData,
        });
        revalidatePath(`/profile/${userId}`);
        return { success: true, user };
    } catch (error) {
        console.log("Error updating profile: ", error);
        return { success: false, error: "Failed to update profile" };
    }
}