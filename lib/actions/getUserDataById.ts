import prisma from "../db";

export async function getUserDataById({userId}: {userId: string}){
    try{
        const res = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(res){
            return {
                message: "User found",
                res,
                status: 200
            }
        }
        return {
            message: "User not found with the given id",
            status: 400
        }
    } catch(error: any){
        return {
            message: "Error finding user",
            error: error.messge,
            status: 500
        }
    }
}