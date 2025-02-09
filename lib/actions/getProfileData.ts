"use server"

import prisma from "../db";

// interface UserDetailsType{
//     name: string;
//     username: string;
//     email: string;
//     points: number;
// }

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

        console.log(res);

        if(res){
            return {
                message: "User found.",
                userDetails: {
                    name: res.name,
                    username: res.username,
                    email: res.email,
                    points: res.points
                },
                status: 200
            }
        }
        return {
            message: "User can't be found with the given username.",
            status: 400
        }
    } catch(error: any){
        return {
            message: "Error finding the user",
            error: error.message,
            status: 500
        }
    }


}