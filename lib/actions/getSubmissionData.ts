import prisma from "../db";
import { getLeaderboard } from "./getLeaderboard";

export async function getSubmissionData(){
    try{
        const res = await prisma.submission.findMany({
            include: {
                user: true
            }
        });

        const leaderboardData = await getLeaderboard();
        console.log(leaderboardData);
        const submissionDetails = [];
        res.map((entry) => {
            const curr = {
                name: entry.user.name,
                username: entry.user.name,
                status: entry.status === "ACCEPTED" ? "true" : "false",
                submissionTime: entry.createdAt
            }
        });
        if(res){
            return {
                message: "Submissions found!",
                res,
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