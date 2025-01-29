"use client"
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
                {problemList.map((problem, i) => <ProblemListItem key={index2++} id={problem.id} title={problem.title} problemTags={problem.tags} indexNumber={i} />)}
            </div>
        </div>
    )
}

function ProblemListItem({id, title, problemTags, indexNumber}: {id: string, title: string, problemTags: ProblemTag[], indexNumber: number}) {
    return (
        <div className="flex ml-5 gap-14 border-b-2 border-gray-200">
            <div className="text-base text-gray-400">
                #{indexNumber + 1}
            </div>
            <Link href={"/problem/" + id}>
            <div className="flex flex-col gap-5">
                <div className="font-thin">
                    {title}
                </div>
                <div className="flex gap-4 mb-6">
                    {problemTags.map(tag => <ProblemTag key={index++} name={tag.name}></ProblemTag>)}
                </div>
            </div>
            </Link>
        </div>
    )
}


function ProblemTag({name} : {name : string}){
    return (
        <div className="bg-neutral-700 py-2 px-2 text-sm text-white">
            {name}
        </div>
    )
}