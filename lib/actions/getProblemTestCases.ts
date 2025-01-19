"use server"

import prisma from "../db";

export async function getProblemTestCases({problemId}: {problemId: string}){
    try{
        const testCases = await prisma.testCases.findMany({
            where: {
                problemId
            }
        });

        if(testCases){
            return {
                success: true,
                testCases,
                message: "Success"
            }
        }
        return {
            success: false,
            testCases: null,
            message: "No test cases found with the given id."
        }
    } catch(error){
        return {
            success: false,
            testCases: null,
            message: "Error finding test cases", error
        }
    }
}