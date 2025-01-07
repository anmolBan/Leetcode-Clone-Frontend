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

    console.log(data);

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
                        {data.examples?.map((example, index) => <ProblemExample input={example.input} output={example.output} explanation={example.explanation}></ProblemExample>)}
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}

function ProblemExample({input, output, explanation}: {input: string | null, output: string | null, explanation: string | null}){
    return (
        <div className="pl-5 pt-5">
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
    )
}