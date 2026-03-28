import { Router } from "express";
import { gemini } from "../llms/gemini.js";
import { Grok } from "../llms/Grok.js";

const router = Router();

router.post('/', async (req, res) => {
    // const providerModel = req.body.model;
    // const model = providerModel.split('/')[1];
    const model = req.body.model;
    const messages = req.body.messages;

    try {
        const response = await Grok.conversation(model, messages);
        return res.status(200).send({
            response
        })
    } catch(error) {
        console.log(error);
        return res.status(400).send({
            message: "The type of the input data does not match the backend format!"
        })
    }
})

export const chatRoutes = router;