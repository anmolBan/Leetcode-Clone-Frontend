"use client"
import Link from "next/link"
import { SigninSignout } from "./SigninSignout"
import { useSession } from "next-auth/react"

export const Topbar = () => {
    return (
        <div className="flex justify-center bg-gray-100">
            <div className="w-8/12 bg-black min-h-56 p-5">
                <img src="/logo.png" className="max-w-56"/>
                <Navbar/>
            </div>
        </div>
    )
}

const navbarItems = [
    {
        title: "About",
        route: "/about"
    }, {
        title: "Activity",
        route: "/activity"
    }, {
        title: "Problems",
        route: "/problems"
    }, {
        title: "Leaderboard",
        route: "/leaderboard"
    }, {
        title: "My profile",
        route: "/profile"
    }
]

let number = 0;
function Navbar(){
    return (
        <div className="flex gap-10">
            {navbarItems.map((item) => <NavbarItem key={number++} route={item.route} title={item.title} />)}
            <SigninSignout/>
        </div>
    )
}

function NavbarItem({title, route} : {
    title: string,
    route: string
}){
    const session = useSession();

    if(title === "My profile"){
        if(session.data?.user){
            return (
                <Link href={route}>
                    <div className="max-10 text-gray-500 cursor-pointer hover:text-white text-base">
                        {title}
                    </div>
                </Link>
            )
        }
        return;
    }
    return (
        <Link href={route}>
            <div className="max-10 text-gray-500 cursor-pointer hover:text-white text-base">
                {title}
            </div>
        </Link>
    )
}