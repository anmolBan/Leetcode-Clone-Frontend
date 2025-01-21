"use server"
import prisma from "../db";

export async function draftCode({code, problemId, userId}: {code: string, problemId: string, userId: string}){
    console.log("code-draft called")
    try{
        const res = await prisma.codeDraft.upsert({
            where: {
                problemId_userId: {
                    problemId,
                    userId
                }
            },
            update: {
                code
            },
            create: {
                code,
                problemId,
                userId,
                language: "JAVASCRIPT"
            }
        });
    
        if(res){
            return {
                message: "Code draft to DB is successful.",
                status: 200
            }
        }
        return {
            message: "Code draft to DB failed.",
            status: 400
        }
    } catch(error: any){
        return {
            message: `Error while code drafting to db ${error.message}`,
            status: 500,
        }
    }
}