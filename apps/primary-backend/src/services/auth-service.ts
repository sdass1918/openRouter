import { prisma } from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { signinInput, signupInput } from "@repo/common";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

export const signup = async (body: signupInput): Promise<String> => {

    const exist = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })
    
    if(exist) {
        return "";
    }

    const User = await prisma.user.create({
        data:{
            email: body.email,
            password: await bcrypt.hash(body.password, 10) 
        }
    })
    return User.id;
}

export const signin = async (body: signinInput): Promise<String> => {
    const user = await prisma.user.findFirst({
        where: {
            email: body.email 
        }
    })

    if(!user) {
        return "";
    }

    if(!await bcrypt.compare(body.password, user.password)) {
        return "";
    }

    const token = await jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return token;
}