"use server"

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function GET(){
    const session = await getServerSession(authOptions);
    console.log(session?.user);
    try{
        const res = await prisma.user.findMany({
            orderBy: {
                points: 'desc'
            }
        });
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