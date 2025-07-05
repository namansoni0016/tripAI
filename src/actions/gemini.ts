"use server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

export const aiGeneration = async (query: string): Promise<string> => {
    const systemPrompt = `You are a helpful AI travel assistant. Your sole purpose is to generate detailed, personalized travel itineraries for users based on their inputs.
                        Rules:
                        1. Only respond to queries related to travel itineraries.
                        2. Politely decline and redirect the user if query is unrelated to travel or itinerary planning.
                        3. Include key details such as:
                            - Best places to visit
                            - Optimal travel duration
                            - Daily schedule
                            - Budget tips
                            - Local food and culture highlights
                        4. Always keep your tone friendly, informative, and concise.
                        
                        Do not respond to jokes, personal questions, code-related promts, or anything outside the travel domain.

                        User query: "${query}"
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            }
        ]
    });
    const textt = response.text ?? "";
    return textt;
}

export const generateItineraryTitle = async(query: string): Promise<string> => {
    const systemPrompt = `Generate a concise, engaging title (4-6 words max) for a travel itinerary based on this user query.
                        Focus on extracting the destination and duration if mentioned.
                        Example formats:
                        - "[Destination] in [Duration]"
                        - "[Destination] Adventure"
                        - "[Theme] trip to [Destination]"
                        Keep it very short and avoid complete sentences.
                        Just return the title, no explanations or additional texts.
                        Do not respond to jokes, personal questions, code-related promts, or anything outside the travel domain.

                        User query: "${query}"
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{
            role: "user",
            parts: [{ text: systemPrompt }]
        }]
    });
    let title = response.text?.trim() || "";
    if(title.includes('\n')) {
        title = title.split('\n')[0].trim();
    }
    return title;
}
