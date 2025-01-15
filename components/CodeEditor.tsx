"use client";

import React, { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup"; // Import from correct package
import { javascript } from "@codemirror/lang-javascript";

const CodeMirrorEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize CodeMirror editor
    const editor = new EditorView({
      doc: "function myCode() {\n  console.log('Hello, World!');\n}",
      extensions: [basicSetup, javascript()],
      parent: editorRef.current,
    });

    // Cleanup on unmount
    return () => {
      editor.destroy();
    };
  }, []);

  return <div ref={editorRef}></div>;
};

export default CodeMirrorEditor;
