"use server"

import { getSubmissionData } from "@/lib/actions/getSubmissionData";
import Link from "next/link";
import PaginationNumberList from "./PaginationNumberList";

interface SubmssionListType{
    name: string;
    username: string;
    status: string;
    problemName: string;
    submissionTime: Date;
}

interface SubmissionDataType{
    message: string;
    res?: SubmssionListType[];
    error?: any;
    totalSubmissionCount?: number;
    status: number;
}

export const SubmissionActivityList = async ({page}: {page: string}) => {

    const submissionData: SubmissionDataType = await getSubmissionData({page});
    const submissionList = submissionData.res || [];

    const sortedSubmissions = submissionList.sort(
        (a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime()
    );
    return (
        <div>
            {sortedSubmissions?.map((item, index) => (
                <div key={index} className="hover:bg-zinc-200 flex justify-center items-center font-mono m-0">
                        <div className="pl-8 my-2 text-zinc-500 w-1/2">
                            <Link className="hover:text-black" href={`/profile/${item.username}`}>
                                {item.name}({item.username})
                            </Link>
                        </div>
                    <div className="flex items-center w-1/2">
                        <div className="w-1/3">
                            <div className="my-2 text-zinc-500 hover:text-black hover:cursor-pointer text-center">
                                <Link href={`/problem/${item.problemName}`}>
                                    {item.problemName}
                                </Link>
                            </div>
                        </div>
                        <div className="w-1/3 my-2 text-zinc-500 text-center">{item.submissionTime.toLocaleTimeString()} - {item.submissionTime.toLocaleDateString()}</div>
                        <div className="ml-5 my-2 w-1/5 text-white text-center">{item.status === "true" ? <div className="bg-green-500 px-2 py-1 rounded-lg">Successful</div> : <div className="bg-red-500 px-2 py-1 rounded-lg">Failed</div>}</div>
                    </div>
                </div>
            ))}
            <div className="my-12 text-center">
                <PaginationNumberList pagePath={"activity"} pageNumber={page} count={submissionData.totalSubmissionCount || -1} entriesPerPage={10}/>
            </div>
        </div>
    )
}
