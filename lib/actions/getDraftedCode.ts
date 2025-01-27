"use server";
import prisma from "../db";

interface DraftedCodeResponse {
  message: string;
  code?: string; // Optional because it might not exist if no draft is found.
  status: number;
}

export async function getDraftedCode({
  userId,
  problemId,
}: {
  userId: string;
  problemId: string;
}): Promise<DraftedCodeResponse> {
  try {
    const res = await prisma.codeDraft.findUnique({
      where: {
        problemId_userId: {
          userId,
          problemId,
        },
      },
    });

    if (res) {
      return {
        message: "Success",
        code: res.code,
        status: 200,
      };
    }

    // Handle case when no draft exists
    return {
      message: "No draft found for the given user and problem.",
      status: 404,
    };
  } catch (error: any) {
    console.error("Error fetching drafted code from the database:", error);
    return {
      message: "Error while getting code from the database.",
      status: 500,
    };
  }
}
