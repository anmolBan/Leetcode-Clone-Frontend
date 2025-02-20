"use client"
import { getProblemList } from "@/lib/actions/getProblemList";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PaginationNumberList from "./PaginationNumberList";

interface TagType{
    name: string;
}

interface ProblemListType {
    title: string;
    tags: TagType[];
}

interface ProblemListResponseType{
    message: string;
    problemList?: ProblemListType[];
    totalProblemCount?: number;
    error?: any;
    status: number;
}

export const ProblemList = ({page} : {page: string}) => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [problemList, setProblemList] = useState<ProblemListType[]>([]);
    const [totalProblemCount, setTotalProblemCount] = useState(-1);

    useEffect(() => {
        if(status === "unauthenticated"){
            router.push("/api/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        async function useEffectFunction(){
            const res : ProblemListResponseType = await getProblemList({page});
            if(!res || !res.problemList){
                return;
            }
            setProblemList(res.problemList);
            setTotalProblemCount(res.totalProblemCount || -1);
        }
        useEffectFunction();
    }, []);
    return (
        <div className="font-mono">
            <div className="pt-3 pl-5 text-2xl font-bold">
                All Problems
            </div>
            <div className="flex flex-col gap-5 mt-10 w-11/12">
                {problemList.map((problem, i) => <ProblemListItem key={i} title={problem.title} problemTags={problem.tags} indexNumber={i} />)}
            </div>
            <div className="my-12 text-center">
                <PaginationNumberList pagePath={"problems"} pageNumber={page} count={totalProblemCount} entriesPerPage={5}/>
            </div>
        </div>
    )
}

function ProblemListItem({title, problemTags, indexNumber}: {title: string, problemTags: TagType[], indexNumber: number}) {
    return (
        <div className="flex ml-5 gap-14 border-b-2 border-gray-200">
            <div className="text-base text-gray-400">
                #{indexNumber + 1}
            </div>
            <Link href={"/problem/" + title}>
            <div className="flex flex-col gap-5">
                <div className="font-thin">
                    {title}
                </div>
                <div className="flex gap-4 mb-6">
                    {problemTags.map((tag, index) => <ProblemTag key={index} name={tag.name}></ProblemTag>)}
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