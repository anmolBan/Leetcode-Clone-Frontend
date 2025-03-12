"use server"

import { Card } from "@/components/Card";
import NumberedProblemList from "@/components/NumberedProblemList";
import { Topbar } from "@/components/Topbar";
import { getProfileData } from "@/lib/actions/getProfileData";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

interface ProfileDataType{
    name: string | null;
    username: string | null;
    email: string | null;
    points: number | null;
}

interface GetProfileDataResponseType{
    message: string;
    userDetails?: ProfileDataType;
    error?: any;
    status: number;
}

export default async function Profile({ params }: { params: { username: string }}){

    const {username} = await params;
    let finalUsername = decodeURIComponent(username);

    const session = await getServerSession(authOptions);
    
    if(!session?.user){
        redirect("/api/auth/signin");
    }
    
    const res: GetProfileDataResponseType = await getProfileData({finalUsername});

    const data = res.userDetails;

    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="flex justify-start w-4/5">
                    <div className="w-4/5 mt-2 font-mono">
                        <Card>
                            <Link href={"/profile/" + finalUsername}>
                                    {finalUsername}
                            </Link>
                            <div className="flex flex-col justify-center mt-2 h-64 bg-blue-600">
                                <div className=" text-[200px] text-white text-center font-extrabold">{(data?.name || "").charAt(0)}</div>
                            </div>
                            {data ? <div className="mt-2 text-lg font-sans">{data.name}</div> : <div>Null</div>}
                            {data ? <div className="font-sans text-sm mb-2">{data.email}</div> : <div>Null</div>}
                        </Card>
                    </div>
                    <NumberedProblemList userId={session.user.id}/>
                </div>

            </div>
        </div>
    )
}