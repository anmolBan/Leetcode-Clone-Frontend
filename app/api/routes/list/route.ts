import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const session = await getServerSession(authOptions);

    // if(!session?.user){
    //     return NextResponse.json({
    //         message: "Unautheticated"
    //     }, {
    //         status: 403
    //     });
    // }

    try{
        const res = await prisma.problem.findMany({
            include: {
                tags: true
            },
        });
        return NextResponse.json({
            data: res
        }, {
            status: 200
        });
    } catch(error){
        console.error(error);
        return NextResponse.json({
            message: "Error getting the details"
        }, {
            status: 500
        });
    }
}