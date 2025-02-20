import prisma from "../db";

interface LeaderboardArrayItemType{
    name: string;
    username: string;
    points: number;
    rank: number;
}

export async function getLeaderboard({leaderboardAPIKey, page}: {leaderboardAPIKey: string | undefined, page: string}){

    if(leaderboardAPIKey !== process.env.LEADERBOARD_API_KEY){
        return {
            message: "Invalid API Key",
            status: 400
        }
    }
    try{
        const totalCount = await prisma.user.count({});

        const res = await prisma.user.findMany({
            orderBy: {
                points: 'desc'
            }
        });

        if(res){
            const data: LeaderboardArrayItemType[] = [];
            res.map((item, index) => {
                const curr = {
                    name: item.name || "",
                    username: item.username || "",
                    points: item.points,
                    rank: index + 1
                }
                data.push(curr);
            });
            return {
                message: "Leaderboard found.",
                data,
                totalLeaderboardCount: totalCount,
                status: 200
            }
        }
        return {
            message: "Leaderboard not found",
            status: 400
        }
    } catch(error: any){
        return {
            message: "Error getting leaderboard",
            error: error.message,
            status: 500
        }
    }
}