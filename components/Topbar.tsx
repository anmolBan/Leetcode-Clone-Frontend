import Link from "next/link"
import { SigninSignout } from "./SigninSignout"

export const Topbar = () => {
    return (
        <div>
            <div className="max-w-screen w-full bg-black min-h-56 p-5">
                <img src="/logo.png" className="max-w-56"/>
                <Navbar/>
            </div>
        </div>
    )
}

const topbarItems = [
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
    }
]

let number = 0;
function Navbar(){
    return (
        <div className="flex gap-10">
            {topbarItems.map(item => <NavbarItem key={number++} route={item.route} title={item.title} />)}
            <SigninSignout/>

        </div>
    )
}

function NavbarItem({title, route} : {
    title: string,
    route: string
}){
    return (
        <Link href={"/"}>
            <div className="max-10 text-slate-500 cursor-pointer hover:text-white text-base">
                {title}
            </div>
        </Link>
    )
}