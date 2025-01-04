import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function GET(){
    // const session = await getServerSession(authOptions);

    // if(!session?.user){
    //     return NextResponse.json({
    //         message: "Unauthenticated"
    //     }, {
    //         status: 403
    //     });
    // }
    // console.log("Anmol");
    try{
        const res = await prisma.user.findMany({
            orderBy: {
                points: 'desc'
            }
        });
        // console.log(res)
        return NextResponse.json({
            res
        }, {
            status: 200
        })
    } catch(error){
        console.error(error);
        return NextResponse.json({
            message: "Error fetching leaderboard"
        }, {
            status: 500
        });
    }
}