import getProblemListForProfile from "@/lib/actions/getProblemListForProfile"
import Link from "next/link";

interface SolvedByListType{
    userId: string;
    problemId: string;
}

interface ProblemListItemType{
    title: string;
    solvedBy: SolvedByListType[];
}

interface GetProblemListResType{
    message: string;
    status: number;
    problemList?: ProblemListItemType[];
    error?: any
}

export default async function NumberedProblemList({userId}: {userId: string}){
    const res: GetProblemListResType = await getProblemListForProfile();

    if(!res || !res.problemList){
        return;
    }
    const problemList = res.problemList;
    return (
        <div className="mt-2 shadow-xl rounded-lg w-1/2 bg-white font-mono">
            <div className="pt-3 pl-5 text-2xl font-bold">
                Problems
            </div>
            <div className="ml-8 mr-8 grid grid-cols-12 gap-0">
                {problemList?.map((item, index) => (
                    <Link href={`/problem/${item.title}`}>
                        <div className={`relative group mt-5 h-8 w-8 ${item.solvedBy.find((item2) => item2.userId === userId) ? "bg-green-500 hover:cursor-pointer" : ""} flex items-center justify-center rounded-lg hover text-zinc-500`} key={index}>
                            {index + 1}
                            <div className="absolute left-1/2 -top-10 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-700 text-nowrap text-white text-xs rounded p-2 shadow-lg">
                                {item.title}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}