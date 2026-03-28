import type { messages, llmResponse } from "@repo/common"

export class llm {
    static async conversation(model: string, message: messages): Promise<llmResponse> {
        throw new Error('Invalid Api key!')
    }
}