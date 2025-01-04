"use server"

import { Card } from "@/components/Card";
import { Topbar } from "@/components/Topbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Profile({
    params: {
        username
    }
}: {
    params: {
        username: string
    }
}){
    const session = await getServerSession(authOptions);

    if(!session?.user){
        redirect("/api/auth/signin");
    }
    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="mt-2 w-8/12">
                    <Card>Hi there</Card>
                </div>
            </div>
        </div>
    )
}