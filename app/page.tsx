"use client"

import { Card } from "@/components/Card";
import { Topbar } from "@/components/Topbar";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session, status} = useSession();

  return (
    <div>
      <Topbar/>
      <div className="flex flex-col items-center h-screen bg-gray-100">
        <div className="mt-2 w-4/5">
          <Card>Hi there</Card>
        </div>
      </div>
    </div>
  );
}
