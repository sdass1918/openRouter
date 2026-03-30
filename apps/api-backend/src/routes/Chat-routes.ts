import { Router } from "express";
import { gemini } from "../llms/Gemini.js";
import { Grok } from "../llms/Grok.js";
import { prisma } from "@repo/db";
import { Mistral } from "../llms/Mistral.js";

const router = Router();

router.post('/', async (req, res) => {
    const apiKey = req.headers.apikey as string;
    if(!apiKey) {
        return res.status(403).send({
            message: 'Please use a valid api key!'
        })
    }

    const apiKeydb = await prisma.apikeys.findFirst({
        where: {
            api_key: apiKey,
            deleted: false,
            disabled: false
        },
        include: {
            user: true
        }
    })

    if(!apiKeydb) {
        return res.status(403).send({
            message: 'Please use a valid api key!'
        })
    }

    const providerModel = req.body.model;
    let [provider, model] = providerModel.split('/');
    console.log(provider);
    console.log(model);
    if(provider === 'openai' || provider === 'mistralai') {
        model = providerModel;
    }
    const messages = req.body.messages;

    try {
        if(model.includes('/') && provider === 'openai') {
            const response = await Grok.conversation(model, messages);
            return res.status(200).send({
                response
            })
        }
        else if(model.includes('/') && provider === 'mistralai') {
            const response = await Mistral.conversation(model, messages);
            return res.status(200).send({
                response
            })
        }
        else if(provider === 'google') {
            const response = await gemini.conversation(model, messages);
            return res.status(200).send({
                response
            })
        }
    } catch(error) {
        console.log(error);
        return res.status(400).send({
            message: "The type of the input data does not match the backend format!"
        })
    }
})

export const chatRoutes = router;