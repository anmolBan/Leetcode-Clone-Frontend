"use server"

import { Topbar } from "@/components/Topbar";
import Link from "next/link";
import { getLeaderboard } from "@/lib/actions/getLeaderboard";
import PaginationNumberList from "@/components/PaginationNumberList";

interface LeaderboardItem {
    name: string,
    username: string,
    points: number,
    rank: number
}

interface LeaderboardDataType{
    message: string;
    status: number;
    data?: LeaderboardItem[];
    totalLeaderboardCount?: number;
    error?: any;
}

export default async function Leaderboard({params} : {params: {page: string}}) {
    const {page} = await params;
    const leaderboardAPIKey = process.env.LEADERBOARD_API_KEY;
    const res : LeaderboardDataType = await getLeaderboard({leaderboardAPIKey, page});
    const leaderboardList = res.data;

    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center bg-gray-100">
                <div className="w-4/5 mt-2 mb-2 h-screen bg-white font-mono">
                    <div className="pt-3 pl-5 text-2xl font-bold">
                        Leaderboard
                    </div>
                    <div className="pl-5">
                        {leaderboardList?.map((item, index) => <LeaderboardItem key={index} name={item.name} points={item.points} index={index} username={item.username} />)}
                    </div>
                    <div className="my-12 text-center">
                        <PaginationNumberList pagePath={"leaderboard"} pageNumber={page} count={res.totalLeaderboardCount || -1} entriesPerPage={10}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LeaderboardItem({name, points, username, index} : {name: string, points: number, username: string, index: number}){
    return (
        <div className="flex gap-14 mt-10">
            <div className="pt-1">{index + 1}</div>
            <div className="h-8 w-8 text-white text-center bg-blue-600 rounded-full flex flex-col justify-center">
                <Link href={"/profile/" + username}>
                    <div>
                        {name.charAt(0).toUpperCase()}
                    </div>
                </Link>
            </div>

            <Link href={"/profile/" + username}>
                <div className="w-60 pt-1 hover:cursor-pointer hover:font-bold">{name}</div>
            </Link>
            <div className="pt-1">{points}</div>
        </div>
    )
}