
import { GoogleGenAI } from "@google/genai";

export const getAIInsight = async (topic: string): Promise<string> => {
    try {
        // Initialize the AI client here, inside the function call.
        // This prevents a crash on load if process.env.API_KEY is not available.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
            As a business strategist, provide a concise analysis of the following market trend. 
            Focus on the primary risks and opportunities for a technology consulting company.
            Keep the response under 150 words and use bullet points for risks and opportunities.
            Trend: "${topic}"
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.5,
                topP: 1,
                topK: 32,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching AI insight:", error);
        if (error instanceof Error) {
            return `Failed to retrieve AI insight. Please check the console for more details. Error: ${error.message}`;
        }
        return "An unknown error occurred while fetching AI insight.";
    }
};
