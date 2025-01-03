"use server"

import prisma from "../db";
import bcrypt from "bcrypt";

export async function handleSignup({name, email, username, password} : {name: string, email: string, username: string, password: string}){
    const hashedPasword = await bcrypt.hash(password, 10);
    try{
        const res = await prisma.user.create({
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