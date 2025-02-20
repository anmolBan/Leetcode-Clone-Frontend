import prisma from "../db";
import { getLeaderboard } from "./getLeaderboard";

export async function getSubmissionData({page}: {page: string}){
    try{
        const totalCount = await prisma.submission.count({});

        const res = await prisma.submission.findMany({
            include: {
                user: true,
                problem: true
            },
            take: 10,
            skip: (parseInt(page) - 1) * 5,
            orderBy: { createdAt: 'desc' }
        });

        const submissionDetails: any = [];
        res.map((entry) => {
            const curr = {
                name: entry.user.name,
                username: entry.user.username,
                problemName: entry.problem.title,
                status: entry.status === "ACCEPTED" ? "true" : "false",
                submissionTime: entry.createdAt,
            }
            submissionDetails.push(curr);
        });
        if(res){
            return {
                message: "Submissions found!",
                res: submissionDetails,
                totalSubmissionCount: totalCount,
                status: 200
            }
        }
        return {
            message: "Submssions not found!",
            status: 400
        }
    } catch(error: any){
        return {
            message: "Error finding submissions",
            error: error.message,
            status: 500
        }
    }
}