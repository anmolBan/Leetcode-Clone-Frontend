"use server"

import { Card } from "@/components/Card";
import { Topbar } from "@/components/Topbar";
import { getProblemData } from "@/lib/actions/getProblemData";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Problem({params} : {
    params: {id: string}
}){
    const {id} = await params;

    const session = await getServerSession(authOptions);

    if(!session?.user){
        redirect("api/auth/signin");
    }

    const data = await getProblemData({id});

    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="w-4/5 mt-2 font-mono">
                    <Card>Hello</Card>
                </div>
            </div>
        </div>
    )
}