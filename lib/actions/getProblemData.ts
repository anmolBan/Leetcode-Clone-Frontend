import prisma from "../db";

export async function getProblemData({problemId} : {problemId: string}){
    try{
        let res = await prisma.problem.findUnique({
            where: {
                id: problemId
            }
        });

        const res2 = await prisma.problemExample.findMany({
            where: {
                problemId
            }
        });

        if(res){
            return {
                success: true,
                res,
                examples: res2,
                message: "Problem found."
            }
        }
        return {
            success: false,
            res: null,
            message: "Problem can't be found with the given id."
        }
    } catch(error){
        return {
            success: false,
            res: null,
            message: "Error finding the problem", error
        }
    }
}