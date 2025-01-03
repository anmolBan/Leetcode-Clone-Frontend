import { ProblemList } from "@/components/ProblemList";
import { Topbar } from "@/components/Topbar";

export default async function Problems(){
    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center bg-gray-100">
                <div className="w-8/12 mt-2 mb-2 h-screen bg-white">
                    <div>
                        <ProblemList/>
                    </div>
                </div>
            </div>
        </div>
    )
}