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

export type apiKeyInput = z.infer<typeof apiKeyInputSchema>;
export type signinInput = z.infer<typeof signinInputSchema>;
export type signupInput = z.infer<typeof signupInputSchema>;
export type apiKeyResponse = z.infer<typeof apiKeyResponseSchema>;
export type apiKeyDisable = z.infer<typeof apiKeyDisableSchema>;