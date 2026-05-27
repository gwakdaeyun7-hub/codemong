"use client";

// CodeMirror 6 기반 Python 코드 에디터. ProjectRunner 에서 dynamic(ssr:false) 으로 로드한다.
// (CodeMirror 는 브라우저 전용 — SSR 단계에서 document 를 참조하므로 ssr:false 가 필요.)

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

export type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-zinc-700">
      <CodeMirror
        value={value}
        onChange={onChange}
        editable={!readOnly}
        theme="dark"
        extensions={[python()]}
        minHeight="200px"
        maxHeight="440px"
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          autocompletion: false,
        }}
        className="text-[13px] [&_.cm-focused]:outline-none"
      />
    </div>
  );
}
