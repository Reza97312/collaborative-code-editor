"use client";
import { useRef, useEffect, useCallback } from "react";
import MonacoEditor, { OnMount, OnChange } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { User, CursorPosition } from "@/types";

interface Props {
  code: string;
  language: string;
  users: User[];
  currentUserId?: string;
  onChange: (code: string) => void;
  onCursorChange: (pos: CursorPosition) => void;
}

const safeKey = (id: string) =>
  id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16) || "u";

export default function Editor({
  code,
  language,
  users,
  currentUserId,
  onChange,
  onCursorChange,
}: Props) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const collectionRef =
    useRef<Monaco.editor.IEditorDecorationsCollection | null>(null);
  const remoteRef = useRef(false);
  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    collectionRef.current = editor.createDecorationsCollection([]);

    if (codeRef.current) {
      remoteRef.current = true;
      editor.setValue(codeRef.current);
      remoteRef.current = false;
    }

    editor.onDidChangeCursorPosition((e) => {
      if (remoteRef.current) return;
      onCursorChange({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
    });
  };

  const handleChange: OnChange = useCallback(
    (value) => {
      if (remoteRef.current) return;
      onChange(value ?? "");
    },
    [onChange],
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.getValue() === code) return;

    const model = editor.getModel();
    if (!model) return;

    const pos = editor.getPosition();
    remoteRef.current = true;

    editor.executeEdits("remote-update", [
      {
        range: model.getFullModelRange(),
        text: code,
        forceMoveMarkers: true,
      },
    ]);

    if (pos) editor.setPosition(pos);
    remoteRef.current = false;
  }, [code]);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const collection = collectionRef.current;
    if (!editor || !monaco || !collection) return;

    const others = users.filter(
      (u) => u.id !== currentUserId && u.cursor != null,
    );

    const STYLE_ID = "collab-cursor-styles";
    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = others
      .map((u) => {
        const k = safeKey(u.id);
        const hex = u.color.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `
        .cc-line-${k} {
          background  : rgba(${r},${g},${b},0.12) !important;
          border-left : 3px solid ${u.color} !important;
          box-sizing  : border-box;
        }
        .cc-glyph-${k} {
          width: 8px !important; height: 8px !important;
          border-radius: 50%;
          background  : ${u.color};
          margin      : 7px 3px 0 4px;
          box-shadow  : 0 0 6px ${u.color}80;
        }
        .cc-name-${k}::after {
          content       : ' ${u.name.replace(/'/g, "\\'")} ';
          background    : ${u.color};
          color         : #fff;
          font-size     : 10px;
          font-weight   : 700;
          border-radius : 3px;
          padding       : 1px 5px;
          margin-left   : 6px;
          letter-spacing: 0.02em;
          pointer-events: none;
          font-family   : sans-serif;
        }
      `;
      })
      .join("\n");

    const decos: Monaco.editor.IModelDeltaDecoration[] = others.map((u) => {
      const k = safeKey(u.id);
      const ln = u.cursor!.lineNumber;
      const col = u.cursor!.column;
      return {
        range: new monaco.Range(ln, col, ln, col),
        options: {
          isWholeLine: true,
          className: `cc-line-${k}`,
          glyphMarginClassName: `cc-glyph-${k}`,
          afterContentClassName: `cc-name-${k}`,
          hoverMessage: { value: `**${u.name}** — line ${ln}, col ${col}` },
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          zIndex: 10,
        },
      };
    });

    collection.set(decos);
  }, [users, currentUserId]);

  return (
    <MonacoEditor
      height="100%"
      language={language}
      onChange={handleChange}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: '"Fira Code","JetBrains Mono",Consolas,monospace',
        fontLigatures: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        glyphMargin: true,
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        padding: { top: 16 },
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
      }}
    />
  );
}
