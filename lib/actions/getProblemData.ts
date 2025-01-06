import prisma from "../db";

export async function getProblemData({id} : {id: string}){
    try{
        const res = await prisma.problem.findUnique({
            where: {
                id
            }
        });

        if(res){
            return {
                success: true,
                res,
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