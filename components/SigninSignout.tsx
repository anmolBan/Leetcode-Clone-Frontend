import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { signIn, signOut, useSession } from "next-auth/react";

export const SigninSignout = () => {
    const session = useSession();
    return (
        <div>
            {(session.data?.user) ? <button className="text-slate-500 hover:text-white" onClick={() => signOut()}>Signout</button> : <button className="text-slate-500 hover:text-white" onClick={() => signIn()}>Signin</button>}
        </div>
    )
}