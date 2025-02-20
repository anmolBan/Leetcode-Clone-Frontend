"use server"

import prisma from "../db";

interface TagType{
    name: string;
}

interface ProblemListType {
    title: string;
    tags: TagType[];
}

export async function getProblemList({page}: {page: string}){
    try{
        const totalCount = await prisma.problem.count({});

        const res = await prisma.problem.findMany({
            include: {
                tags: true
            },
            take: 10,
            skip: (parseInt(page) - 1) * 10,
            orderBy: {createdAt : "desc"}
        });

        const problemList: ProblemListType[] = [];

        if(res){
            res.map((item) => {
                const currTags : TagType[] = []
                item.tags.map((tag) => {
                    const curr = {
                        name: tag.name
                    }
                    currTags.push(curr);
                });
                const curr = {
                    title: item.title,
                    tags: currTags
                }
                problemList.push(curr);
            });
            return {
                message: "Problem list found",
                problemList,
                totalProblemCount: totalCount,
                status: 200
            }
        }
        return {
            message: "Problem list not found",
            status: 400
        }
    } catch(error: any){
        return {
            message: "Error finding list",
            error: error.message || "",
            status: 500
        }
    }
}