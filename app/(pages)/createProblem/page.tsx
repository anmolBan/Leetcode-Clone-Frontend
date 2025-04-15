"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CreateProblem from "@/lib/actions/createProblem"
import { Topbar } from "@/components/Topbar"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Extension } from "@tiptap/core"
import MonacoEditor from "@monaco-editor/react";

// Match the schema enums
enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

// Updated test case type to match the expected structure
type TestCase = {
  input: any // Any valid JSON
  output: any // Any valid JSON
}

// Create a custom extension to handle Enter key presses
const HardBreakOnEnter = Extension.create({
  name: "hardBreakOnEnter",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        // Insert a hard break (BR tag) instead of a new paragraph
        editor.commands.setHardBreak()
        return true
      },
    }
  },
})

export default function AddProblemPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    points: 100,
    difficulty: Difficulty.MEDIUM,
    tags: [] as string[],
  })

  // Initialize with empty objects for flexibility
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      input: {},
      output: {},
    },
  ])

  // For managing input fields in the UI
  const [testCaseInputs, setTestCaseInputs] = useState<string[]>([JSON.stringify({}, null, 2)])
  const [testCaseOutputs, setTestCaseOutputs] = useState<string[]>([JSON.stringify({}, null, 2)])

  const [codeTemplate, setCodeTemplate] = useState<string | undefined>("");

  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable code block from StarterKit
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      HardBreakOnEnter, // Add our custom extension
    ],
    content: formData.problemStatement,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, problemStatement: editor.getHTML() }))
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] px-4 py-2",
      },
      // Custom paste handler to strip formatting
      handlePaste: (view, event) => {
        // If it's plain text, let TipTap handle it normally
        const text = event.clipboardData?.getData("text/plain")
        if (text) {
          // Insert plain text at the current position
          const { state } = view
          const tr = state.tr.insertText(text, state.selection.from, state.selection.to)
          view.dispatch(tr)
          return true // Prevent default paste behavior
        }
        return false // Let TipTap handle other types of content
      },
    },
    // Add this to preserve whitespace
    parseOptions: {
      preserveWhitespace: "full",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseInt(value) || 0
    setFormData((prev) => ({ ...prev, [name]: numValue }))
  }

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, difficulty: e.target.value as Difficulty }))
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault()
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()],
        }))
      }
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleTestCaseInputChange = (index: number, value: string) => {
    try {
      // Update the string representation for the UI
      const updatedInputs = [...testCaseInputs]
      updatedInputs[index] = value
      setTestCaseInputs(updatedInputs)

      // Try to parse the JSON for the actual data structure
      const parsedInput = JSON.parse(value)
      const updatedTestCases = [...testCases]
      updatedTestCases[index] = {
        ...updatedTestCases[index],
        input: parsedInput,
      }
      setTestCases(updatedTestCases)
    } catch (error) {
      // If JSON is invalid, just update the string but don't update the test case object
      console.log(error || "There was an unexpected error")
      const updatedInputs = [...testCaseInputs]
      updatedInputs[index] = value
      setTestCaseInputs(updatedInputs)
    }
  }

  const handleTestCaseOutputChange = (index: number, value: string) => {
    try {
      // Update the string representation for the UI
      const updatedOutputs = [...testCaseOutputs]
      updatedOutputs[index] = value
      setTestCaseOutputs(updatedOutputs)

      // Try to parse the JSON for the actual data structure
      const parsedOutput = JSON.parse(value)
      const updatedTestCases = [...testCases]
      updatedTestCases[index] = {
        ...updatedTestCases[index],
        output: parsedOutput,
      }
      setTestCases(updatedTestCases)
    } catch (error) {
      // If JSON is invalid, just update the string but don't update the test case object
      console.log(error || "There was an unexpected error.")
      const updatedOutputs = [...testCaseOutputs]
      updatedOutputs[index] = value
      setTestCaseOutputs(updatedOutputs)
    }
  }

  const addTestCase = () => {
    // Add a new test case with empty objects
    setTestCases([...testCases, { input: {}, output: {} }])
    setTestCaseInputs([...testCaseInputs, JSON.stringify({}, null, 2)])
    setTestCaseOutputs([...testCaseOutputs, JSON.stringify({}, null, 2)])
  }

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index))
      setTestCaseInputs(testCaseInputs.filter((_, i) => i !== index))
      setTestCaseOutputs(testCaseOutputs.filter((_, i) => i !== index))
    }
  }

  const validateTestCases = (): boolean => {
    // Check if all test cases have valid JSON
    for (let i = 0; i < testCaseInputs.length; i++) {
      try {
        JSON.parse(testCaseInputs[i])
        JSON.parse(testCaseOutputs[i])
      } catch (e) {
        console.log(e)
        alert(`Test case #${i + 1} has invalid JSON. Please fix before submitting.`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate test cases before submission
    if (!validateTestCases()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Ensure all test cases have valid JSON
      const validTestCases = testCases.map((tc, index) => ({
        input: JSON.parse(testCaseInputs[index]),
        output: JSON.parse(testCaseOutputs[index]),
      }))

      const problemData = {
        ...formData,
        testCases: validTestCases,
        codeTemplate: codeTemplate
      }

      const response: {
        message: string
        status: number
        success: boolean
        error?: any
      } = await CreateProblem({ problemData })

      if (response.success) {
      } else {
        throw new Error(response.error || "Failed to add problem")
      }

      // Reset form
      setFormData({
        title: "",
        problemStatement: "",
        points: 100,
        difficulty: Difficulty.MEDIUM,
        tags: [],
      });
      setCodeTemplate("");
      setTestCases([{ input: {}, output: {} }])
      setTestCaseInputs([JSON.stringify({}, null, 2)])
      setTestCaseOutputs([JSON.stringify({}, null, 2)])

      // Reset editor content
      editor?.commands.setContent("")

      alert("Problem added successfully!")
      // Redirect to problems list
      // router.push('/admin/problems')
    } catch (error) {
      console.error("Error adding problem:", error)
      alert(`Failed to add problem: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Topbar />
      <div className="w-full bg-zinc-100">
        <div className="container py-10 max-w-3xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Add New Problem</h1>
              <p className="text-gray-600 mt-1">Create a new coding problem for your platform</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Problem Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Two Sum, Valid Parentheses"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700">
                    Problem Statement
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    {/* Editor Menu */}
                    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                        title="Bold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                        title="Italic"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="19" y1="4" x2="10" y2="4"></line>
                          <line x1="14" y1="20" x2="5" y2="20"></line>
                          <line x1="15" y1="4" x2="9" y2="20"></line>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("underline") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                        title="Underline"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                          <line x1="4" y1="21" x2="20" y2="21"></line>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("heading", { level: 2 }) ? "bg-gray-200" : "hover:bg-gray-200"}`}
                        title="Heading"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 12h12"></path>
                          <path d="M6 4v16"></path>
                          <path d="M18 4v16"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                        title="Bullet List"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                        title="Ordered List"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="10" y1="6" x2="21" y2="6"></line>
                          <line x1="10" y1="12" x2="21" y2="12"></line>
                          <line x1="10" y1="18" x2="21" y2="18"></line>
                          <path d="M4 6h1v4"></path>
                          <path d="M4 10h2"></path>
                          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("blockquote") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                        title="Blockquote"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                      {/* Add a dedicated line break button */}
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().setHardBreak().run()}
                        className="px-2 py-1 rounded hover:bg-gray-200"
                        title="Line Break"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 8H3"></path>
                          <path d="M21 16H3"></path>
                          <path d="M3 8v8"></path>
                          <path d="M21 8v8"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Editor Content */}
                    <div className="editor-container">
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Format your problem statement with rich text formatting options. Press Enter for a line break.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                      Points
                    </label>
                    <input
                      id="points"
                      name="points"
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={handleNumberChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                      Difficulty
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleDifficultyChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={Difficulty.EASY} className="text-green-500 font-medium">
                        EASY
                      </option>
                      <option value={Difficulty.MEDIUM} className="text-yellow-500 font-medium">
                        MEDIUM
                      </option>
                      <option value={Difficulty.HARD} className="text-red-500 font-medium">
                        HARD
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                        >
                          <span className="sr-only">Remove tag</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    id="tags"
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type a tag and press Enter (e.g., Array, String, Dynamic Programming)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Press Enter to add a tag</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Test Cases</label>
                    <button
                      type="button"
                      onClick={addTestCase}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Test Case
                    </button>
                  </div>

                  {testCases.map((_, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">Test Case #{index + 1}</h4>
                        {testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor={`testCase-${index}-input`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Input (JSON format)
                          </label>
                          <textarea
                            id={`testCase-${index}-input`}
                            value={testCaseInputs[index]}
                            onChange={(e) => handleTestCaseInputChange(index, e.target.value)}
                            placeholder={`// Example for Two Sum:\n{\n  "nums": [2, 7, 11, 15],\n  "target": 9\n}\n\n// Example for String problem:\n{\n  "s": "hello",\n  "pattern": "ll"\n}`}
                            rows={8}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          />
                          <p className="text-xs text-gray-500">
                            Input must be a valid JSON object with parameters specific to your problem
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor={`testCase-${index}-output`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Expected Output (JSON format)
                          </label>
                          <textarea
                            id={`testCase-${index}-output`}
                            value={testCaseOutputs[index]}
                            onChange={(e) => handleTestCaseOutputChange(index, e.target.value)}
                            placeholder={`// Example for Two Sum:\n[0, 1]\n\n// Example for String problem:\n2\n\n// Or more complex output:\n{\n  "result": true,\n  "position": 2\n}`}
                            rows={6}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          />
                          <p className="text-xs text-gray-500">
                            Output can be any valid JSON value (array, object, number, string, boolean, etc.)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    <label htmlFor="code-template" className="block text-sm font-medium mb-2 text-gray-700">
                      Code Template
                    </label>
                    <MonacoEditor
                      height="80vh"
                      defaultLanguage="javascript"
                      value={codeTemplate}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                      onChange={(value: string | undefined) => {
                        setCodeTemplate(value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Adding Problem..." : "Add Problem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}