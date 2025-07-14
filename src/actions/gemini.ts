"use server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

interface ItineraryResponse {
    itinerary: string;
    isRelated: boolean;
    locations: string[];
}

export const aiGeneration = async(query: string) : Promise<ItineraryResponse> => {
    const systemPrompt = `You are a travel assistant. Follow these rules STRICTLY:
                        1. **Check if the query is travel related**:
                            - If **NO**, return:
                                \`\`\`json
                                {
                                    "itinerary": "Sorry, I can't help you with that!",
                                    "isRelated": false,
                                    "locations": []
                                }
                                \`\`\`
                            - If **YES**, generate a **Markdown-formatted itinerary** and list locations.
                        2. **For travel related queries**:
                            - Format itinerary in **Markdown** (use headings, bullet points, bold text).
                            - Include: 
                                - **Best places to visit**
                                - **Daily Schedule**
                                - **Food/Culture Tips**
                                - **Budget advice**
                            - Extract **all locations** (cities, landmarks, places, restaurants, and every locations mentioned in itinerary).
                        3. **Output must be valid JSON**:
                            \`\`\`json
                            {
                                "itinerary": "## Tokyo 3-Day Itinerary\\n\\n**Day 1:**\\n -Visit shibuya crossing...",
                                "isRelated": true,
                                "locations": ["Shibuya", "Asakusa", ...] 
                            }
                            \`\`\`
                        
                        User Query: "${query}"
                    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{
            role: "user",
            parts: [{ text: systemPrompt }]
        }]
    });
    try {
        const jsonString = response.text?.replace(/```json|```/g, '').trim() || '{}';
        return JSON.parse(jsonString) as ItineraryResponse;
    } catch (error) {
        console.error("Failed to parse AI response: ", error);
        return {
            itinerary: "Error generating itinerary. Please try again.",
            isRelated: false,
            locations: []
        }
    }
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
