"use server";

import MonacoEditorWrapper from "@/components/CodeEditor";
import { Topbar } from "@/components/Topbar";
import { getProblemData } from "@/lib/actions/getProblemData";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Problem({ params }: { params: { problemId: string } }) {
  const { problemId } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("api/auth/signin");
  }

  const data = await getProblemData({ problemId });

  return (
    <div>
      <Topbar />
      <div className="flex flex-col items-center h-screen bg-gray-100">
        <div className="flex w-4/5 mt-2 bg-white font-mono">
          {/* Problem Details Section */}
          <div className="flex-1 pr-10">
            <div className="pt-3 pl-5 text-2xl font-bold">{data.res?.title}</div>
            <div className="pl-5 pt-8">{data.res?.problemStatement}</div>
            <div>
              {data.examples?.map((example, index) => (
                <ProblemExample
                  key={index}
                  input={example.input}
                  output={example.output}
                  explanation={example.explanation}
                  index={index}
                />
              ))}
            </div>
            <div className="my-5 pl-5">
              <div className="font-extrabold mb-2">Constraints:</div>
              {data.res?.constraints.map((constraint, index) => (
                <div key={index} className="flex">
                  <div className="flex flex-col justify-center">
                    <div className="h-[8px] w-[8px] bg-black rounded-lg"></div>
                  </div>
                  <div className="bg-neutral-700 w-fit my-1 ml-3 py-1 px-2 text-sm rounded-lg text-white">
                    {constraint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor Section */}
          <div className="flex-1 pl-10">
            <div className="h-full border-l-2 border-gray-200 rounded-md">
              <div className="pl-5 flex flex-col rounded-t-lg text-white justify-center text-xl font-bold bg-zinc-500">Code Editor</div>
              <MonacoEditorWrapper codeTemplate={"function twoSum(nums, target){\n\t//write your code here\n}"} problemId={problemId}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemExample({
  input,
  output,
  explanation,
  index,
}: {
  input: string | null;
  output: string | null;
  explanation: string | null;
  index: number;
}) {
  return (
    <div className="pl-5 pt-5">
      <div className="font-extrabold">Example {index + 1}:</div>
      <div className="pl-4 border-l-2 mt-1">
        <div className="flex gap-2">
          <div className="font-extrabold">Input:</div>
          {input}
        </div>
        <div className="flex gap-2">
          <div className="font-extrabold">Output:</div>
          {output}
        </div>
        {explanation !== null ? (
          <div className="flex gap-2">
            <div className="font-extrabold">Explanation:</div>
            {explanation}
          </div>
        ) : null}
      </div>
    </div>
  );
}
