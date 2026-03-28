import { Router } from "express";
import { getModels, getProviderForModel, getProviders } from "../services/models-service.js";
const router = Router();

router.get('/', async (req, res) => {
    const user = (req as any).user?.userId;
    if(!user) {
        return res.status(401).send({
            message: "Unauthorized access!"
        })
    }
    try {
        const models = await getModels();
        return res.status(200).send(models);
    } catch (error) {
        console.log(error);
        return res.status(404).send("Can't find the data now!")
    }
})

router.get('/providers', async (req, res) => {
    const user = (req as any).user?.userId;
    if(!user) {
        return res.status(401).send({
            message: "Unauthorized access!"
        })
    }
    try {
        const providers = await getProviders();
        return res.status(200).send(providers);
    } catch (error) {
        console.log(error);
        return res.status(404).send("Can't find the data now!")
    }
})

router.get('/:id', async (req, res) => {
    const user = (req as any).user?.userId;
    if(!user) {
        return res.status(401).send({
            message: "Unauthorized access!"
        })
    }
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