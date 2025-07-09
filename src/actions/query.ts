"use server";
import { db } from "@/lib/db";
import { generateItineraryTitle } from "./gemini";

export async function createSavedQuery(userId: string, queryText: string, response: string, locations: string[]) {
    try {
        if(!userId) {
            return { success: false, error: "User Id is required" };
        }
        const title = await generateItineraryTitle(queryText);
        const generatedQuery = await db.query.create({
            data: {
                queryText: title,
                response,
                userId,
                locations,
            }
        });
        return { success: true, data: generatedQuery, message: "Trip saved successfully" };
    } catch (error) {
        console.log("Failed to save generated query: ", error);
        return { success: false, error: "Failed to save the generated query" };
    }
}

export const getQuery = async (queryId: string): Promise<{
    queryText: string;
    response: string;
    locations: string[];
} | null> => {
    const result =  await prisma?.query.findUnique({
        where: { id: queryId },
        select: {
            queryText: true,
            response: true,
            locations: true,
        }
    });
    return result || null;
};