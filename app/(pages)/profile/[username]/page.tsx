"use server"

import { Card } from "@/components/Card";
import { Topbar } from "@/components/Topbar";
import { getProfileData } from "@/lib/actions/getProfileData";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Profile({ params }: { params: { username: string }}){

    const {username} = await params;
    const finalUsername = decodeURIComponent(username);

    const session = await getServerSession(authOptions);
    
    if(!session?.user){
        redirect("/api/auth/signin");
    }
    
    const data = await getProfileData({finalUsername});

    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="w-4/5 mt-2 font-mono">
                    <Card>
                        <Link href={"/profile/" + finalUsername}>
                                {finalUsername}
                        </Link>
                        <div className="flex flex-col justify-center mt-2 h-64 bg-blue-600">
                            <div className=" text-[200px] text-white text-center font-extrabold">{data.res?.name?.charAt(0)}</div>
                        </div>
                        {data.success ? <div className="mt-2 text-lg font-sans">{data.res?.name}</div> : <div>Null</div>}
                        {data.success ? <div className="font-sans text-sm mb-2">{data.res?.email}</div> : <div>Null</div>}
                    </Card>
                </div>

            </div>
        </div>
    )
}