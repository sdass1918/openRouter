import { Router } from "express";
import { signupInputSchema, signinInputSchema } from "@repo/common"
import { signin, signup } from "../services/auth-service.js";

const router = Router();


router.post('/sign-up', async (req, res) => {
    const response = signupInputSchema.safeParse(req.body);

    if(!response.success) {
        return res.status(400).send({
            message: "Invalid data",
            error: response.error
        })
    }
    try {
        const data = response.data;

        if(!data) {
            return res.status(400).send({
                message: "Invalid data!"
            })
        }

        const userId = await signup(data);

        if(userId === "") {
            return res.status(400).send({
                message: "User already exists!"
            })
        }

        res.status(200).send({
            message: "Sign-up successful!",
            userId
        });
    } catch (error) {
        throw new Error(`${error}`);
    }
    
})

router.post('/sign-in', async (req, res) => {
    const response = signinInputSchema.safeParse(req.body);
    if(!response.success) {
        return res.status(403).send({
            message: "Invalid data",
            error: response.error
        })
    }

    try {
        const data = response.data;

        if(!data) {
            return res.status(400).send({
                message: "Invalid data!"
            })
        }

        const token = await signin(data);

        if(token === "") {
            res.status(403).send({
                message: "The user does not exist!"
            })
        }

        res.status(200).send({
            token
        })

    } catch (error) {
        throw new Error(`${error}`)
    }
    
})

export const authRoutes = router;