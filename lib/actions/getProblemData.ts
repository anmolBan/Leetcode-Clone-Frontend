import prisma from "../db";

export async function getProblemData({problemTitleOrId} : {problemTitleOrId: string}){
    try{
        const res = await prisma.problem.findFirst({
            where: {
                OR: [
                    { title: problemTitleOrId },
                    { id: problemTitleOrId }
                ]
            }
        });
        
        if(res){
            let res2 = await prisma.codeTemplate.findFirst({
                where: {
                    problemId: res.id
                }
            });


            return {
                success: true,
                res: {
                    id: res.id,
                    title: res.title,
                    problemStatement: res.problemStatement,
                    points: res.points,
                    difficulty: res.difficulty,
                    codeTemplate: res2?.code || "No code template has been found."
                },
                message: "Problem found"
            }
        }
        return {
            success: false,
            res: null,
            message: "Problem can't be found with the given id."
        }
    } catch(error){
        return {
            success: false,
            res: null,
            message: "Error finding the problem", error
        }
    }
}