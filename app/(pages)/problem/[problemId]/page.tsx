"use server"

import { Card } from "@/components/Card";
import { Topbar } from "@/components/Topbar";
import { getProblemData } from "@/lib/actions/getProblemData";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Problem({params} : {
    params: {problemId: string}
}){
    const {problemId} = await params;

    const session = await getServerSession(authOptions);

    if(!session?.user){
        redirect("api/auth/signin");
    }

    const data = await getProblemData({problemId});

    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="w-4/5 mt-2 pr-20 bg-white font-mono">
                    <div className="pt-3 pl-5 text-2xl font-bold">
                        {data.res?.title}
                    </div>
                    <div className="pl-5 pt-8">
                        {data.res?.problemStatement}
                    </div>
                    <div>
                        {data.examples?.map((example, index) => <ProblemExample input={example.input} output={example.output} explanation={example.explanation} index={index}></ProblemExample>)}
                    </div>
                    <div className="my-5 pl-5">
                        <div className="font-extrabold mb-2">Constraints:</div>
                        {data.res?.constraints.map((constraint, index) => (
                            <div className="flex">
                                <div className=" flex flex-col justify-center">
                                    <div className="h-[8px] w-[8px] bg-black rounded-lg"></div>
                                </div>
                                <div className="bg-neutral-700 w-fit my-1 ml-3 py-1 px-2 text-sm rounded-lg text-white">{constraint}</div>
                            </div>))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProblemExample({input, output, explanation, index}: {input: string | null, output: string | null, explanation: string | null, index: number}){
    return (
        <div className="pl-5 pt-5">
            <div className="font-extrabold">Example {index + 1}:</div>
            <div className="pl-4 border-l-2 mt-1">
                <div className="flex gap-2">
                    <div className="font-extrabold">Input:</div>
                    {input}
                </div>
                <div className="flex gap-2">
                    <div className="font-extrabold">Output:</div>
                    {output}
                </div>
                {explanation !== null ? <div className="flex gap-2">
                    <div className="font-extrabold">Explanation:</div>
                    {explanation}
                </div> : null}
            </div>
        </div>
    )
}