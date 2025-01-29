import { SubmissionActivityList } from "@/components/SubmissionActivityList";
import { Topbar } from "@/components/Topbar";
import Link from "next/link";

export default function Activity(){
    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="w-4/5 mt-2 mb-2 bg-white font-mono">
                    <div className="pt-3 pl-5 text-2xl font-bold">
                        Activity
                    </div>
                    <div className="mt-10 pb-20 pl-5 w-11/12 ">
                        <SubmissionActivityList/>
                    </div>
                </div>
            </div>
        </div>
    )
}