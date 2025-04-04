/*
  Warnings:

  - You are about to drop the column `constraints` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the `ProblemExample` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProblemExample" DROP CONSTRAINT "ProblemExample_problemId_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "constraints";

-- DropTable
DROP TABLE "ProblemExample";
