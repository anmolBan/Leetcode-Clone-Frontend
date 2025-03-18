import { getProblemData } from "@/lib/actions/getProblemData";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";

export async function POST(req: NextRequest){

    const submissionSchema = zod.object({
        userId: zod.string(),
        problemId: zod.string(),
        code: zod.string(),
        language: zod.string(),
        solved: zod.boolean(),
        status: zod.string()
    });
    let alreadyAccepted = false;
    try{
        const body = await req.json();
        const parsedBody = submissionSchema.safeParse(body);
        if(!parsedBody.success){
            return NextResponse.json({
                message: "Invalid inputs recieved in the route submission."
            }, {
                status: 400
            });
        }
        if(!body.userId || !body.problemId){
            return NextResponse.json({
                message: "inputs missing."
            });
        }
        let status;
        if(body.status === "ACCEPTED"){
            status = "ACCEPTED"
        }
        else if(body.status === "WRONG_ANSWER"){
            status = "WRONG_ANSWER"
        }
        else if(body.status === "TLE"){
            status = "TIME_LIMIT_EXCEEDED"
        }
        else{
            status = body.status;
        }

        const res = await prisma.solvedProblem.findUnique({
            where:{
                userId_problemId: {
                    userId: body.userId,
                    problemId: body.problemId
                }
            }
        });

        if(res){
            alreadyAccepted = true;
        }

        if(body.solved && !alreadyAccepted){
            await prisma.solvedProblem.create({
                data: {
                    userId: body.userId,
                    problemId: body.problemId
                }
            });
            alreadyAccepted = true;

            const problemId = body.problemId;
            const problemTitleOrId = problemId;

            const problemData: any = await getProblemData({problemTitleOrId});
            const points = problemData.res.points;

            if(problemData){
                await prisma.user.update({
                    where: {
                        id: body.userId
                    },
                    data: {
                        points: {
                            increment: points
                        }
                    }
                });
            }
        }

        await prisma.submission.create({
            data: {
                userId: body.userId,
                problemId: body.problemId,
                code: body.code,
                language: body.language,
                status
            }
        });

        return NextResponse.json({
            message: "Success"
        }, {
            status: 200
        })
    } catch(error: any){
        return NextResponse.json({
            message: `Error while submission to DB, ${error.message}`
        }, {
            status: 500
        });
    }
}