import { SubmissionActivityList } from "@/components/SubmissionActivityList";
import { Topbar } from "@/components/Topbar";

export default async function Activity({params} : {params: {page: string}}){
    let { page } = await params;
    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="w-4/5 mt-2 mb-2 bg-white font-mono">
                    <div className="pt-3 pl-5 text-2xl font-bold">
                        Activity
                    </div>
                    <div className="mt-10 pb-30">
                        <SubmissionActivityList page={page}/>
                    </div>
                </div>
            </div>
        </div>
    )
}