import { Router } from "express";
import { gemini } from "../llms/Gemini.js";
import { Openai } from "../llms/Openai.js";
import { prisma } from "@repo/db";
import { Mistral } from "../llms/Mistral.js";
import { conversationSchema } from "@repo/common"

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

    const Model = req.body.model;
    let [company, model] = Model.split('/');
    console.log(company);
    console.log(model);
    const messages = conversationSchema.safeParse(req.body.messages);
    if(!messages.success) {
        return res.status(411).send({
            message: messages.error
        })
    }

    try {
        if(company === 'openai') {
            const response = await Openai.conversation(Model, messages.data);
            return res.status(200).send({
                response
            })
        }
        else if(company === 'mistralai') {
            const response = await Mistral.conversation(Model, messages.data);
            return res.status(200).send({
                response
            })
        }
        else if(company === 'google') {
            const response = await gemini.conversation(Model, messages.data);
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