"use client";

import { useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { draftCode } from "@/lib/actions/draftCode";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handleSubmitButton } from "@/lib/actions/handleSubmitButton";
import { getDraftedCode } from "@/lib/actions/getDraftedCode";

interface MonacoEditorWrapperPropsType {
  codeTemplate: string;
  problemId: string
}

const MonacoEditorWrapper = ({codeTemplate, problemId} : MonacoEditorWrapperPropsType) => {
  const [code, setCode] = useState(codeTemplate);
  const localTimeout = useRef<NodeJS.Timeout | null>(null);
  const dbTimeout = useRef<NodeJS.Timeout | null>(null);

  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if(status === "unauthenticated"){
      router.push("/api/auth/signin");
    }
  }, [status, router]);


  const userId = session?.user.id || "";

  useEffect(() => {
    async function fetchCode(){
      const savedCode = localStorage.getItem(`${problemId}-code`);
      if(savedCode) {
        setCode(savedCode);
      }
      else{
        const res: any = await getDraftedCode({userId, problemId});
        if(res.status !== 404){
          const currCode = res.code;
          setCode(currCode);
        }
        else{
          setCode(codeTemplate);
        }
      }
    }
    fetchCode();
  }, [problemId, userId, codeTemplate]);

  function handleEditorChange(value: string | undefined){
    if(!session?.user.id){
      router.push("/api/auth/signin");
    }
    setCode(value || "");
    if(localTimeout.current){
      clearTimeout(localTimeout.current);
    }
    localTimeout.current = setTimeout(() => {
      localStorage.setItem(`${problemId}-code`, value || "");
    }, 2000);

    if(dbTimeout.current){
      clearTimeout(dbTimeout.current);
    }

    dbTimeout.current = setTimeout(() => {
      draftCode({code, problemId, userId});
    }, 20000); 
  };

  async function onSubmitHandler(){
    try{
      const data : any = await handleSubmitButton({userId, problemId, code});
      console.log(data.error);
      if(data.success){
        alert("Success");
      }
      else{
        alert(`Submission Failed!\n\nError: ${data.error}`);
      }
    } catch(error: any){
      console.log(error.message);
    }
  }

  return (
    <div>
        <MonacoEditor
          height="80vh"
          defaultLanguage="javascript"
          value={code}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onChange={handleEditorChange}
        />
        <div className="flex justify-center mt-5">
          <button onClick={onSubmitHandler} className="px-4 py-2  bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">Submit</button>
        </div>
    </div>
  );
};

export default MonacoEditorWrapper;
