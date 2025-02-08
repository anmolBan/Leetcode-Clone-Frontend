"use server"

import { getSubmissionData } from "@/lib/actions/getSubmissionData";

interface SubmssionType{
    name: string;
    username: string;
    status: string;
    problemName: string;
    submissionTime: Date;
}

interface SubmissionDataType{
    message: string;
    res?: SubmssionType[];
    error?: any;
    status: number;
}

export const SubmissionActivityList = async () => {

    const submissionData: SubmissionDataType = await getSubmissionData();
    const submissionList = submissionData.res || [];

    const sortedSubmissions = submissionList.sort(
        (a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime()
    );
    return (
        <div>
            {sortedSubmissions?.map((item, index) => (
                <div className="hover:bg-zinc-200 flex font-mono m-0">
                    <div className="pl-8 my-2 text-zinc-500 hover:text-black hover:cursor-pointer w-1/2">{item.name}({item.username})</div>
                    <div className="flex justify-evenly w-1/2">
                        <div className="pl-8 my-2 text-zinc-500 hover:text-black hover:cursor-pointer">{item.problemName}</div>
                        <div className="pl-8 my-2 text-zinc-500">{item.submissionTime.toLocaleTimeString()} - {item.submissionTime.toLocaleDateString()}</div>
                        <div className="pl-8 my-2 text-black">{item.status === "true" ? <div className="bg-green-500 px-2 py-1 rounded-lg">Successful</div> : <div className="bg-red-500 px-2 py-1 rounded-lg">Failed</div>}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}
