import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const { searchParams } = new URL(req.url);
        const problemId = searchParams.get("problemId");
        if(!problemId){
            return NextResponse.json(
                {
                    message: "Problem id is required",
                    status: 400
                }
            )
        }
        const res = await prisma.testCases.findMany({
            where: {
                problemId
            },
            select: {
                id: false,
                input: true,
                output: true,
                problemId: false
            }
        });

        if(!res){
            return NextResponse.json(
                {
                    message: "No problem found with the given problem id.",
                    status: 400
                }
            )
        }

        return NextResponse.json(
            {
                message: "Test cases found",
                testCases: res,
                status: 200
            }
        )
    } catch(error: any){
        return NextResponse.json({
            message: error.message,
            status: 500
        });
    }
}