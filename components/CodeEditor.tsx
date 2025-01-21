"use client";

import { useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { draftCode } from "@/lib/actions/draftCode";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const MonacoEditorWrapper = ({codeTemplate, problemId} : {codeTemplate: string, problemId: string}) => {
  let [code, setCode] = useState(codeTemplate);
  let localTimeout = useRef<NodeJS.Timeout | null>(null);
  let dbTimeout = useRef<NodeJS.Timeout | null>(null);

  const {data: session, status} = useSession();
  const router = useRouter();

  if(status === "unauthenticated"){
    router.push("/api/auth/signin");
  }

  const userId = session?.user.id || "";


   // Fetch code from localStorage after the component has mounted
   useEffect(() => {
    const savedCode = localStorage.getItem("code");
    if (savedCode) {
      setCode(savedCode);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  function handleEditorChange(value: string | undefined){
    setCode(value || "");
    if(localTimeout.current){
      clearTimeout(localTimeout.current);
    }
    localTimeout.current = setTimeout(() => {
      localStorage.setItem("code", value || "");
    }, 2000);

    if(dbTimeout.current){
      clearTimeout(dbTimeout.current);
    }

    dbTimeout.current = setTimeout(() => {
      draftCode({code, problemId, userId});
      console.log("waah ji waah");
    }, 2000); 
  };

  async function onSubmitHandler(){

    const res = await axios.post("http://localhost:3001/submit-code", {
        problemId,
        code,
        language: "JAVASCRIPT"
    });

    console.log(res.data);
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
        <button onClick={onSubmitHandler}>Submit</button>
    </div>
  );
};

export default MonacoEditorWrapper;
