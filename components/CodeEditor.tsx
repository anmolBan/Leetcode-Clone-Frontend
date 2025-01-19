"use client";

import { useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { getProblemTestCases } from "@/lib/actions/getProblemTestCases";

const MonacoEditorWrapper = ({codeTemplate, problemId} : {codeTemplate: string, problemId: string}) => {
  let [code, setCode] = useState(localStorage.getItem("code") || codeTemplate);
  let localTimeout = useRef<NodeJS.Timeout | null>(null);
  let dbTimeout = useRef<NodeJS.Timeout | null>(null);

  function handleEditorChange(value: string | undefined){
    setCode(value || "");
    if(localTimeout.current){
      clearTimeout(localTimeout.current);
    }
    localTimeout.current = setTimeout(() => {
      localStorage.setItem("code", value || "");
      console.log(value);
    }, 2000);
  };

  async function onSubmitHandler(){

    const testCases = (await getProblemTestCases({problemId})).testCases;

    const res = await axios.post("http://localhost:3001/submit-code", {
        code,
        testCases,
        language: "JAVASCRIPT"
    });

    console.log(res);
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
