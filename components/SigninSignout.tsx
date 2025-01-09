import { signIn, signOut, useSession } from "next-auth/react";

export const SigninSignout = () => {
    const session = useSession();
    return (
        <div className="font-mono font-extrabold text-lg">
            {(session.data?.user) ? <button className="text-gray-500 hover:text-white" onClick={() => signOut()}>Signout</button> : <button className="text-gray-500 hover:text-white" onClick={() => signIn()}>Signin</button>}
        </div>
    )
}