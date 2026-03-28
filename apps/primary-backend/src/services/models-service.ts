import { prisma } from "@repo/db"

export const getModels = async () => {
    const models = await prisma.models.findMany();
    return models;
}

export const getProviders = async () => {
    const providers = await prisma.providers.findMany();
    return providers;
}

export const getProviderForModel = async (modelId: string) => {
    const mappings = await prisma.model_provider_mapping.findMany({
        where: { modelId },
        include: {
            provider: true
        }
    });
    return mappings.map(m => m.provider);
}

