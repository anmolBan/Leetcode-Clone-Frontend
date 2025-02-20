import { ProblemList } from "@/components/ProblemList";
import { Topbar } from "@/components/Topbar";

export default async function Problems({params} : {params: {page: string}}){
    const {page} = await params;
    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center bg-gray-100">
                <div className="w-4/5 mt-2 mb-2 h-screen bg-white">
                    <div>
                        <ProblemList page={page}/>
                    </div>
                </div>
            </div>
        </div>
    )
}