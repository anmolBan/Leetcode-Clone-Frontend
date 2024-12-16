"use client"

import LandingPage from "@/components/LandingPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const session = useSession();
  return (
    <div>
      <LandingPage/>

      {session.data?.user && <button onClick={() => signOut()}>Logout</button>}
    </div>
  );
}
