import type { apiKeyInput, apiKeyResponse } from "@repo/common";
import { prisma } from "@repo/db";

const ALPHABET_SET = "qwertyuicvbhjioasdfghjkltghnxcvghj1234567rhjSDFGHJKCVHJRTGHJMPOKJHVXCFGH"
const createRandomApi = () => {
    let suffixKey = "";
    for(let i=0; i<20; i++) {
        suffixKey += ALPHABET_SET[Math.floor(Math.random() * ALPHABET_SET.length)];
    }
    return `sko-or-v1-${suffixKey}`
}

export const addApiKeys = async (data: apiKeyInput, userId: string): Promise<{created: Boolean, apiKey: apiKeyResponse | null}> => {
    const apiKey = createRandomApi();
    const apiKeydb = await prisma.apikeys.create({
        data: {
            name: data.name,
            api_key: apiKey,
            userId
        },
    })
    if(apiKeydb) {
        return {
            created: true,
            apiKey: {
                id: apiKeydb.id,
                name: apiKeydb.name,
                apikey: apiKeydb.api_key,
                lastUsed: apiKeydb.lastUsed?.toString()!,
                creditsConsumed: apiKeydb.creditsConsumed,
                disabled: apiKeydb.disabled
            }
        };
    }
    return {
        created: false,
        apiKey: null
    };
}

export const getApiKeys = async (userId: string): Promise<apiKeyResponse[]> => {
    const apis = await prisma.apikeys.findMany({
        where: {
            userId: userId,
            deleted: false
        }
    })
    return apis.map((api) => ({
        id: api.id,
        name: api.name,
        apikey: api.api_key,
        lastUsed: api.lastUsed?.toString() ?? null,
        creditsConsumed: api.creditsConsumed,
        disabled: api.disabled
    }))
}

export const updateApiKey = async (apiKeyid: string, userId: string, disable: Boolean) => {
    const apiKey = await prisma.apikeys.update({
        where: {
            id: apiKeyid,
            userId
        },
        data :{
            disabled: Boolean(disable)
        }
    })
    return apiKey;
}

export const deleteApiKey = async (apiKeyid: string, userId: string) => {
    await prisma.apikeys.update({
        where : {
            id: apiKeyid,
            userId
        },
        data: {
            deleted: true
        }
    })
}
