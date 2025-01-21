/*
  Warnings:

  - A unique constraint covering the columns `[problemId,userId]` on the table `CodeDraft` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CodeDraft_problemId_userId_key" ON "CodeDraft"("problemId", "userId");
