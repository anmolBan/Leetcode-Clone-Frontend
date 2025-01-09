"use client";

import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

const MonacoEditorWrapper = () => {
  const [code, setCode] = useState("// Write your code here");

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

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
      <button onClick={() => console.log(code)}>Submit</button>
    </div>
  );
};

export default MonacoEditorWrapper;
