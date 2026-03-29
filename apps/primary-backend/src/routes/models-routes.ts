import { Router } from "express";
import type { ModelResponse } from "@repo/common";
import { getAllData, getModels, getProviderForModel, getProviders } from "../services/models-service.js";
const router = Router();

router.get('/models-and-providers', async (req, res) => {
    try {
        const models = await getAllData();
        const response: ModelResponse = models.map((model) => ({
            name: model.name,
            slug: model.slug,
            providers: model.provider.map((provider) => ({
                provider: provider.provider.name,
                providerWebsite: provider.provider.website,
                inputTokenCost: provider.inputTokenCost,
                outputTokenCost: provider.outputTokenCost
            }))
        }))
        return res.status(200).json(response);
    } catch (error) {
        throw new Error();
    }
})

router.get('/', async (req, res) => {
    try {
        const models = await getModels();
        return res.status(200).send(models);
    } catch (error) {
        console.log(error);
        return res.status(404).send("Can't find the data now!")
    }
})

router.get('/providers', async (req, res) => {
    try {
        const providers = await getProviders();
        return res.status(200).send(providers);
    } catch (error) {
        console.log(error);
        return res.status(404).send("Can't find the data now!")
    }
})

router.get('/:id', async (req, res) => {
    try {
        const providers = await getProviderForModel(req.params.id);
        if(!providers) {
            throw new Error();
        }
        return res.status(200).send(providers);
    } catch (error) {
        console.log(error);
        return res.status(404).send("Can't find the data now!")
    }
})


export const modelsRouter = router;