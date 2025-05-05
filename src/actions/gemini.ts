"use server";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

export const aiGeneration = async (query: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: query,
    });
    const textt = response.text ?? "";
    return textt;
}
