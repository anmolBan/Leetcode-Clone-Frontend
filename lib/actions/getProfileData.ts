import prisma from "../db";

export async function getProfileData({username} : {username: string}) {
    try{
        const res = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if(res){
            return {
                success: true,
                res
            }
        }
        return {
            success: false,
            res: null,
            message: "User can't be found with the given username."
        }
    } catch(error){
        return {
            success: false,
            res: null,
            message: "Error finding the user", error
        }
    }


}