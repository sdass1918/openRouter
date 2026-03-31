import dotenv from 'dotenv';
import axios from 'axios';
import type { llmResponse, messages } from "@repo/common";
import { llm } from "./Base.js";
dotenv.config();

const invokeUrl = process.env.INVOKE_URL!;
const stream = false;

const apiKey = process.env.GEMINI_API_KEY;
if(!apiKey) {
    throw new Error('Api key not available for gemini this time!')
}

const headers = {
  "Authorization": `Bearer ${apiKey}`,
  "Accept": stream ? "text/event-stream" : "application/json"
};

export class gemini extends llm {
    static async conversation(model: string, messages: messages) {
        const payload = {
            "model": model,
            "messages": messages,
            "max_tokens": 512,
            "temperature": 0.20,
            "top_p": 0.70,
            "frequency_penalty": 0.00,
            "presence_penalty": 0.00,
            "stream": stream
        };
        try {
            const response = await axios.post(invokeUrl, payload, {
                headers: headers,
                responseType: stream ? 'stream' : 'json'
            });
            return {
                completions: {
                    choices: [
                        {
                            message: {
                                content: response.data.choices[0].message.content
                            }
                        }
                    ]
                },
                inputTokens: response.data.usage.prompt_tokens,
                outputTokens: response.data.usage.completion_tokens
            } as llmResponse
        } catch (error) {
            console.log(error);
            throw new Error(`${error}`); 
        }
    }
}
