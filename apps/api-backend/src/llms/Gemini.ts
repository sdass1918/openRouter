import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import type { llmResponse, messages } from "@repo/common";
import { llm } from "./Base.js";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if(!apiKey) {
    throw new Error('Api key not available for gemini this time!')
}
const ai = new GoogleGenAI({
    apiKey
});


export class gemini extends llm {
    static async conversation(model: string, messages: messages) {

        try {
            const response = await ai.models.generateContent({
                model,
                contents: messages.map((message) => ({
                    role: message.role,
                    parts: [{ text: message.content }],
                }))
            });
            return {
                completions: {
                    choices: [
                        {
                            message: {
                                content: response.text!
                            }
                        }
                    ]
                },
                inputTokens: response.usageMetadata?.promptTokenCount,
                outputTokens: response.usageMetadata?.candidatesTokenCount
            } as llmResponse
        } catch (error) {
            throw new Error(`${error}`); 
        }
    }
}