import { Topbar } from "@/components/Topbar";

export default async function Profile(){
    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="w-8/12 my-2 bg-white font-mono">
                    <div className="pt-3 pl-5 text-2xl font-bold">
                        My Profile
                    </div>
                </div>
            </div>
        </div>
    )
}