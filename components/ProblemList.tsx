"use client"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

let index = 0;
let index2 = 0;

interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    createdAt: string;
    updatedAt: string;
    tags: ProblemTag[];
}

interface ProblemTag {
    id: string;
    name: string;
    probleId: string;
}

export const ProblemList = () => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [problemList, setProblemList] = useState<Problem[]>([]);

    useEffect(() => {
        if(status === "unauthenticated"){
            router.push("/api/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        async function useEffectFunction(){
            const res = await axios.get<{data: Problem[]}>("http://localhost:3000/api/routes/list", {
                withCredentials: true
            });
            setProblemList(res.data.data);
        }
        useEffectFunction();
    }, [])
    return (
        <div className="font-mono">
            <div className="pt-3 pl-5 text-2xl font-bold">
                All Problems
            </div>
            <div className="flex flex-col gap-5 mt-10 w-11/12">
                {problemList.map((problem, i) => <ProblemListItem key={index2++} title={problem.title} problemTags={problem.tags} indexNumber={i}></ProblemListItem>)}
            </div>
        </div>
    )
}

function ProblemListItem({title, problemTags, indexNumber}: {title: string, problemTags: ProblemTag[], indexNumber: number}) {
    return (
        <div className="flex ml-5 gap-14 border-b-2 border-gray-200">
            <div className="text-base text-gray-400">
                #{indexNumber + 1}
            </div>
            <div className="flex flex-col gap-5">
                <div className="font-thin">
                    {title}
                </div>
                <div className="flex gap-4 mb-6">
                    {problemTags.map(tag => <div className="bg-neutral-700 py-1 px-1 text-xs text-white" key={index++}>{tag.name}</div>)}
                </div>
            </div>
        </div>
    )
}