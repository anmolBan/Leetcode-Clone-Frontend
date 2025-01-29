/*
  Warnings:

  - You are about to drop the `_SubmissionToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SubmissionToUser" DROP CONSTRAINT "_SubmissionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubmissionToUser" DROP CONSTRAINT "_SubmissionToUser_B_fkey";

-- DropTable
DROP TABLE "_SubmissionToUser";

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
