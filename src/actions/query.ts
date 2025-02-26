import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function createSavedQuery(queryText: string, response: string) {
    try {
        const session = await auth();
        if(!session || !session.user?.id) {
            return { success: false, error: "User not authenticated!" };
        }
        const userId = session.user.id;
        const generatedQuery = await db.query.create({
            data: {
                queryText,
                response,
                userId,
            }
        });
        return { success: true, data: generatedQuery, message: "Trip saved successfully" };
    } catch (error) {
        console.log("Failed to save generated query: ", error);
        return { success: false, error: "Failed to save the generated query" };
    }
}