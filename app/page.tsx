"use client"

import { Card } from "@/components/Card";
import { Topbar } from "@/components/Topbar";

export default function Home() {

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
