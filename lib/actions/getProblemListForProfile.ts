import prisma from "../db";

interface SolvedByType{
    userId: string;
    problemId: string;
}

interface ProblemListType{
    title: string;
    solvedBy: SolvedByType[];
}

export default async function getProblemListForProfile(){
    try{
        const res = await prisma.problem.findMany({
            include: {
                solvedBy: true
            }
        });

        const problemList: ProblemListType[] = [];

        if(!res){
            return {
                message: "Can't find the problem list",
                status: 400
            }
        }

        res.map((item, index) => {
            const currSolvedBy: SolvedByType[] = [];
            item.solvedBy.map((item2, index) => {
                const curr2 = {
                    userId: item2.userId,
                    problemId: item2.problemId
                }
                currSolvedBy.push(curr2);
            })
            const curr = {
                title: item.title,
                solvedBy: currSolvedBy
            }
            problemList.push(curr);
        });

        return {
            message: "List found successfully",
            problemList,
            status: 2000
        }


    } catch(error: any){
        return {
            message: "Error finding problem list",
            error: error.message,
            status: 500
        }
    }
}