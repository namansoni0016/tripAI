"use server";

import { db } from "@/lib/db";

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
            },
        });
        return user;
    } catch (error) {
        console.log("Error fetching profile: ", error);
        throw new Error("Failed to fetch profile");
    }
}