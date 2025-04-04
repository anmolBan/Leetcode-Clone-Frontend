import CreateProblemButton from "@/components/CreateProblemButton";
import { ProblemList } from "@/components/ProblemList";
import { Topbar } from "@/components/Topbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Problems({params} : {params: Promise<{page: string}>}){
    const session = await getServerSession(authOptions);
    const {page} = await params;
    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center font-mono bg-gray-100">
                <div className="w-4/5 mt-2 mb-2 h-screen bg-white">
                    <div>
                        <ProblemList page={page}/>
                    </div>
                    <div className="flex justify-center w-full">
                        {session?.user.isAdmin && <CreateProblemButton/>}
                    </div>
                </div>
            </div>
        </div>
    )
}