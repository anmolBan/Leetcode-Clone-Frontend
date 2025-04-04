"use client"
import { useRouter } from "next/navigation"

export default function CreateProblemButton(){
    const router = useRouter();
    function onClickHandler(){
        router.push("/createProblem")
    }
    return(
        <div>
            <button className="bg-black text-white px-2 py-1 rounded-lg" onClick={onClickHandler}>Create new Problem</button>
        </div>
    )
}