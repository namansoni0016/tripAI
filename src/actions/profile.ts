"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { profileSchema } from "../../schemas";

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

export async function updateProfile(data: unknown) {
    const session = await auth();
    if(!session || !session.user) {
        throw new Error("Unauthorized");
    }
    try {
        const validatedData = profileSchema.parse(data);
        const updatedUser = await prisma?.user.update({
            where: { id: session.user.id },
            data: {
                name: validatedData.name,
                image: validatedData.image,
            }
        });
        revalidatePath(`/profile/${session.user.id}`);
        return { success: true, user: updatedUser };
    } catch (error) {
        console.log("Error updating profile: ", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function getQueryById(queryId: string) {
    try {
        const query = await db.query.findUnique({
            where: { id: queryId },
            select: {
                queryText: true,
                response: true,
            },
        });
        return query;
    } catch (error) {
        console.log("Error fetch query by id: ", error);
        throw new Error("Failed to saved trip");
    }
}

export async function deleteSavedTrip(queryId: string) {
    try {
        const session = await auth();
        if(!session || !session.user) {
            throw new Error("Unauthorized");
        }
        const userId = session.user.id;
        const savedTrip = await db.query.findUnique({
            where: { id: queryId },
            select: { userId: true },
        });
        if(!savedTrip) throw new Error("Trip not found!");
        if(savedTrip.userId !== userId) throw new Error("Unauthorized - no delete permission!");
        await db.query.delete({
            where: { id: queryId },
        });
        revalidatePath(`/profile/${userId}`);
        return { success: true };
    } catch (error) {
        console.log("Failed to delete trip: ", error);
        return { success: false, error: "Failed to delete trip!" };
    }
}