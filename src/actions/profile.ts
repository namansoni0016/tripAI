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