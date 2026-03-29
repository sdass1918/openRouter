import { z } from "zod";

export const signupInputSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export const signinInputSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export const apiKeyInputSchema = z.object({
    name: z.string()
})

export const apiKeyDisableSchema = z.object({
    id: z.string()
})

export const apiKeyResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    apikey: z.string(),
    lastUsed: z.nullable(z.string()),
    creditsConsumed: z.number(),
    disabled: z.boolean()
})

export const conversationSchema = z.array(z.object({
    role: z.enum({
        USER: 'user',
        ASSISTANT: 'assistant'
    }),
    content: z.string()
}))

export const llmResponseSchema = z.object({ 
    completions: z.object({
        choices: z.array(
            z.object({
                message: z.object({
                    content: z.string(),
                }),
            })
        ),
    }),
    inputTokens: z.number(),
    outputTokens: z.number()
});

export const ModelResponseScehma =  z.array(z.object({
    name: z.string(),
    slug: z.string(),
    providers: z.array(z.object({
        provider: z.string(),
        providerWebsite: z.string(),
        inputTokenCost: z.number(),
        outputTokenCost: z.number()
    }))
}));

export type ModelResponse = z.infer<typeof ModelResponseScehma>
export type llmResponse = z.infer<typeof llmResponseSchema>;
export type messages = z.infer<typeof conversationSchema>;
export type apiKeyInput = z.infer<typeof apiKeyInputSchema>;
export type signinInput = z.infer<typeof signinInputSchema>;
export type signupInput = z.infer<typeof signupInputSchema>;
export type apiKeyResponse = z.infer<typeof apiKeyResponseSchema>;
export type apiKeyDisable = z.infer<typeof apiKeyDisableSchema>;