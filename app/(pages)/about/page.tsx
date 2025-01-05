import { Topbar } from "@/components/Topbar";

export default async function About() {
    return (
        <div>
            <Topbar/>
            <div className="flex flex-col items-center h-screen bg-gray-100">
                <div className="w-4/5 mt-2 mb-2 bg-white font-mono">
                    <div className="pt-3 pl-5 text-2xl font-bold">
                        About
                    </div>
                    <div className="mt-10 pb-20 pl-5 w-11/12 ">
                        Meetcode is an application for Coding Geeks to try out new coding problems and keep track of who solves what. Named after one of the most prolific coding websites of all times, <span className="font-bold">Leetcode</span>, it is a portal for users to test their mettle on various coding problems.
                    </div>
                </div>
            </div>
        </div>
    )
}