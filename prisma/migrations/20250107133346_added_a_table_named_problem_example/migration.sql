-- CreateTable
CREATE TABLE "ProblemExample" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT,
    "output" TEXT,
    "explanation" TEXT,

    CONSTRAINT "ProblemExample_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProblemExample" ADD CONSTRAINT "ProblemExample_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
