/*
  Warnings:

  - You are about to drop the column `problemId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_problemId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "problemId";

-- CreateTable
CREATE TABLE "_ProblemToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProblemToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProblemToTag_B_index" ON "_ProblemToTag"("B");

-- AddForeignKey
ALTER TABLE "_ProblemToTag" ADD CONSTRAINT "_ProblemToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToTag" ADD CONSTRAINT "_ProblemToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
