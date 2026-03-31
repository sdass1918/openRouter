import axios from 'axios';
import { llm } from './Base.js';
import type { messages, llmResponse } from '@repo/common';

const invokeUrl = process.env.INVOKE_URL!;
const stream = false;

const headers = {
  "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
  "Accept": stream ? "text/event-stream" : "application/json"
};


export class Mistral extends llm {
    static async conversation(model: string, message: messages): Promise<llmResponse> {
        const payload = {
            "model": model,
            "reasoning_effort": "high",
            "messages": message,
            "max_tokens": 16384,
            "temperature": 0.10,
            "top_p": 1.00,
            "stream": stream
        };
        try {
            const response = await axios.post(invokeUrl, payload, {
                headers: headers,
                responseType: stream ? 'stream' : 'json'
            })
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
            } as llmResponse;
        } catch (error) {
            console.log(error);
            throw new Error(`${error}`);
        }
    }
}
