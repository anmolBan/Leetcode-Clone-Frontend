"use server";
/* eslint-disable */

import zod from "zod";
import prisma from "../db";

export default async function CreateProblem({
  problemData,
}: {
  problemData: {
    title: string;
    problemStatement: string;
    points: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tags: string[];
    testCases: { input: {}; output: {} }[];
  };
}) {
  const CreateProblemSchema = zod.object({
    title: zod.string(),
    problemStatement: zod.string(),
    points: zod.number(),
    difficulty: zod.string(),
    tags: zod.array(zod.string()),
    testCases: zod.array(
      zod.object({
        input: zod.object({}),
        output: zod.object({}),
      })
    ),
  });

  const parsedProblemData = CreateProblemSchema.safeParse(problemData);

  if (!parsedProblemData.success) {
    return {
      message: "Invalid input.",
      status: 400,
      success: false,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Step 1: Create the problem
      const problem = await tx.problem.create({
        data: {
          title: problemData.title,
          problemStatement: problemData.problemStatement,
          points: problemData.points,
          difficulty: problemData.difficulty,
        },
      });

      // Step 2: Upsert tags and connect them to the problem
      const tags = problemData.tags.map(async (tag) => {
        await prisma.tag.upsert({
            where: {name: tag},
            update: {
                problems: {
                    connect: { id: problem.id },
                },
            },
            create: {
                name: tag,
                problems: {
                    connect: { id: problem.id }
                },
            },
        })
    });

      // Step 3: Create test cases in bulk
      if (problemData.testCases.length > 0) {
        await tx.testCases.createMany({
          data: problemData.testCases.map((testCase) => ({
            input: testCase.input,
            output: testCase.output,
            problemId: problem.id,
          })),
        });
      }
    });

    return {
      message: "Problem created successfully!",
      status: 201,
      success: true,
    };
  } catch (error: any) {
    console.error("Error creating problem:", error);
    return {
      message: "An error occurred while creating the problem.",
      status: 500,
      success: false,
      error
    };
  }
}
