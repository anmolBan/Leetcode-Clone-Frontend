/*
  Warnings:

  - You are about to drop the column `description` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `problemStatement` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "description",
ADD COLUMN     "constraints" TEXT[],
ADD COLUMN     "examples" TEXT[],
ADD COLUMN     "problemStatement" TEXT NOT NULL;
