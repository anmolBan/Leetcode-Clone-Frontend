"use client";

import { useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";

const MonacoEditorWrapper = ({codeTemplate, problemId} : {codeTemplate: string, problemId: string}) => {
  let [code, setCode] = useState(localStorage ? localStorage.getItem("code") || "" : codeTemplate);
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
