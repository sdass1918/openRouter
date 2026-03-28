import { Router } from "express";
import { apiKeyInputSchema } from "@repo/common";
import { addApiKeys, deleteApiKey, getApiKeys, updateApiKey } from "../services/apiKey-service.js";

const router = Router();

router.post('/', async (req, res) => {
    const userId = (req as any).user?.userId;

    if(!userId) {
        return res.status(401).send({
            message: "Unauthorized!"
        })
    }
    const response = apiKeyInputSchema.safeParse(req.body);

    if(!response.success) {
        return res.status(400).send({
            message: "Invalid data!"
        })
    }

    try {
        const data = response.data;
        const result = await addApiKeys(data, userId);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            message: "Bad request!"
        });
    }
})

router.get('/', async (req, res) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const apiKeys = await getApiKeys(userId);
        
        return res.json(apiKeys);
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "Data not found!"
        });
    }
});

router.put('/', async (req, res) => {
    const user = (req as any).user?.userId;
    if(!user) {
        return res.status(401).send({
            message: "Unauthorized access!"
        })
    }
    try {
        const response = await updateApiKey(req.body.id, user, req.body.disable);
        return res.status(200).send({
            message: "Updated apikey successfully",
            response
        })
    } catch (error) {
        return res.status(400).send({
            message: "Disabling the api-key is unsuccessful!"
        })
    }
})

router.delete('/:id', async (req, res) => {
    const user = (req as any).user?.userId;
    if(!user) {
        return res.status(401).send({
            message: "Unauthorized access!"
        })
    }
    try {
        await deleteApiKey(req.params.id, user);
        res.status(200).send({
            message: "The apikey has been deleted successfully!"
        })
    } catch { 
        return res.status(404).send({
            message: "Unable to delete the api-key for now!"
        })
    }
})

export const apiKeyRoutes = router;