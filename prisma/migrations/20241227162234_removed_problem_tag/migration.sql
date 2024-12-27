/*
  Warnings:

  - You are about to drop the `ProblemTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `problemId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProblemTag" DROP CONSTRAINT "ProblemTag_problemId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemTag" DROP CONSTRAINT "ProblemTag_tagId_fkey";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "problemId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProblemTag";

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
