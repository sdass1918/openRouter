import OpenAI from "openai";
import { llm } from './Base.js';
import type { messages, llmResponse } from '@repo/common';

const apiKey = process.env.GROK_API_KEY;
if(!apiKey) {
    throw new Error('Api key not available for gemini this time!')
}


const client = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1", 
});

export class Grok extends llm {
    static async conversation(model: string, message: messages): Promise<llmResponse> {
        try {
            const response = await client.responses.create({
                model,
                input: message.map((message) => ({
                    role: message.role === "user" ? "user" : "system",
                    content: message.content
                }))
            })
            return {
                completions: {
                    choices: [
                        {
                            message: {
                                content: response.output_text!
                            }
                        }
                    ]
                },
                inputTokens: response.usage?.input_tokens,
                outputTokens: response.usage?.output_tokens
            } as llmResponse;
        } catch(error) {
            throw new Error(`${error}`);
        }
    }
}