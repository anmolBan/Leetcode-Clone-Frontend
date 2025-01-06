import prisma from "../db";

export async function getProfileData({finalUsername} : {finalUsername: string}) {
    try{
        const res = await prisma.user.findFirst({
            where: {
                OR : [
                    {email: finalUsername},
                    {username: finalUsername}
                ]
            }
        });

        if(res){
            return {
                success: true,
                res,
                message: "User found."
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