"use client"
import { useRouter } from "next/navigation";

export default function PaginationNumberList({pagePath, pageNumber, count, entriesPerPage}: {pagePath: string, pageNumber: string, count: number, entriesPerPage: number}){
    const router = useRouter();
    function onNextClickHanlder(){
        router.push(`/${pagePath}/${parseInt(pageNumber) + 1}`)
    }

    function onPrevClickHandler(){
        router.push(`/${pagePath}/${parseInt(pageNumber) - 1}`)
    }

    return (
        <div>
            {parseInt(pageNumber) === 1 ? null : <button onClick={onPrevClickHandler} className="bg-black mx-2 py-1 px-2 rounded-xl text-white">Prev</button>}
            {parseInt(pageNumber) * entriesPerPage >= count ? null : <button className="bg-black py-1 px-2 rounded-xl text-white" onClick={onNextClickHanlder}>Next</button>}
        </div>
    )
}