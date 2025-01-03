"use client"

import { Topbar } from "@/components/Topbar";
import { useEffect, useState } from "react";
import axios from "axios";

interface LeaderboardItem {
    id: string,
    name: string,
    points: number
}

let i = 0;

export default function Leaderboard() {

    const [leaderboardList, setLeaderboardList] = useState<LeaderboardItem[]>();

    useEffect(() => {
        async function useEffectFunction(){
            const res = await axios.get<{res: LeaderboardItem[]}>("/api/routes/leaderboard", {
                withCredentials: true
            });
            console.log(res.data.res);
            setLeaderboardList(res.data.res);
        }
        useEffectFunction();
    }, [])

    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center bg-gray-100">
                <div className="w-8/12 mt-2 mb-2 h-screen bg-white font-mono">
                    <div className="pt-3 pl-5 text-2xl font-bold">
                        Leaderboard
                    </div>
                    <div className="pl-5">
                        {leaderboardList?.map((item, index) => <LeaderboardItem key={i++}  name={item.name} points={item.points} index={index}/>)}
                        <LeaderboardItem name={"Anmol Kumar"} points={150} index={2}/>
                        <LeaderboardItem name={"Anmol Kumar"} points={150} index={2}/>
                        <LeaderboardItem name={"Anmol Kumar"} points={150} index={2}/>
                        <LeaderboardItem name={"Anmol Kumar"} points={150} index={2}/>
                        <LeaderboardItem name={"Anmol Kumar"} points={150} index={2}/>
                        <LeaderboardItem name={"Anmol Kumar"} points={150} index={2}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LeaderboardItem({name, points, index} : {name: string, points: number, index: number}){
    return (
        <div className="flex gap-14 mt-10">
            <div className="pt-1">{index + 1}</div>
            <div className="h-8 w-8 text-white text-center bg-blue-600 rounded-full flex flex-col justify-center">
                <div>
                    {name.charAt(0).toUpperCase()}
                </div>
            </div>
            <div className="w-60 pt-1">{name}</div>
            <div className="pt-1">{points}</div>
        </div>
    )
}