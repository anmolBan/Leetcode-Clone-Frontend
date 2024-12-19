"use client"

import { Card } from "@/components/Card";
import { SigninSignout } from "@/components/SigninSignout";
import { Topbar } from "@/components/Topbar";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  return (
    <div className=" flex justify-center w-full ">
      <div className="w-7/12">
        <Topbar/>
        <Card>Hi there</Card>
      </div>
    </div>
  );
}
