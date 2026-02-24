import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor = ({ code, onChange, readOnly = false, height = "100%" }: CodeEditorProps) => {
  return (
    <Editor
      height={height}
      defaultLanguage="python"
      value={code}
      onChange={(val) => onChange(val || "")}
      theme="vs-dark"
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: "on",
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "gutter",
        cursorBlinking: "smooth",
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
      }}
    />
  );
};

export default CodeEditor;
