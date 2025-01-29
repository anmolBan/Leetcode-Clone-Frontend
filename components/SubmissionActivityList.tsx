"use server"

import { getSubmissionData } from "@/lib/actions/getSubmissionData";

interface SubmssionType{
    id: string;
    code: string;
    language: string;
    userId: string;
    problemId: string;
    status: string;
    createdAt: Date;
}

interface SubmissionDataType{
    message: string;
    res?: SubmssionType[];
    error?: any;
    status: number;
}

export const SubmissionActivityList = async () => {

    const submissionData: SubmissionDataType = await getSubmissionData();
    return (
        <div>
            Submission Activity List
        </div>
    )
}
