"use server"

import prisma from "../db";
import bcrypt from "bcrypt";
import zod from "zod";

export async function handleSignup({name, email, username, password} : {name: string, email: string, username: string, password: string}){

    const signupInputSchema = zod.object({
        name: zod.string(),
        email: zod.string().email(),
        username: zod.string(),
        password: zod.string().min(8).max(20)
    });

    const parsedData = signupInputSchema.safeParse({name, email, username, password});

    if(!parsedData.success){
        return {
            success: false,
            message: "Invalid inputs."
        }
    }


    const hashedPasword = await bcrypt.hash(password, 10);
    try{
        await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPasword
            }
        });
        return {
            success: true,
            message: "User created successfully."
        }
    } catch(error: any){
        console.log("Server error:", error.message);
        return {
            success: false,
            error: error.message || "An unexpected error occurred."
        };
    }
}