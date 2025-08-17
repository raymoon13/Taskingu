import { GoogleGenAI, Type } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.

class GeminiClient {

    ai: GoogleGenAI;
    model: string;
    systemInstruction: string;

    constructor() {
        this.ai = new GoogleGenAI({
            apiKey : import.meta.env.GEMINI_KEY
        });
        this.model = "gemini-2.5-flash";
        this.systemInstruction = "You are a Task Manager. Improve the description that user gives so it looks more professional and descriptive also be able to put in Azure DevOps no need steps explanation";
    }

    async generateContent(raw_input: string) {

        try {
            const response = await this.ai.models.generateContent({
                model: this.model,
                contents: raw_input,
                config: {
                    systemInstruction: this.systemInstruction,
                    responseMimeType: "application/json",
                    responseJsonSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        }
                    }
                }
            });
            return JSON.parse(response.text!);
        } catch (error) {
            console.error("Error generating content:", error);
            throw new Error("Failed to generate content");
        }
    }
}

export const geminiClient = new GeminiClient();