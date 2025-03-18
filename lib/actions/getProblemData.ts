import prisma from "../db";

interface ExamplesType{
    input: string;
    output: string;
    explanation?: string;
}

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

        let problemId;
        if(res){
            problemId = res.id;
        }

        const res2 = await prisma.problemExample.findMany({
            where: {
                problemId
            }
        });

        if(res && res2){
            const examples : ExamplesType[] = [];

            res2.map((example) => {
                const curr = {
                    input: example.input || "",
                    output: example.output || "",
                    explanation: example.explanation || ""
                }
                examples.push(curr);
            });

            return {
                success: true,
                res: {
                    id: res.id,
                    title: res.title,
                    problemStatement: res.problemStatement,
                    constraints: res.constraints,
                    points: res.points,
                    difficulty: res.difficulty
                },
                examples,
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