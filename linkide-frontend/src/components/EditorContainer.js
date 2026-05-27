// src/components/EditorContainer.js
'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

export default function EditorContainer({ socket, roomId, language, code, setCode }) {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  // Map language strings to Monaco editor language identifiers
  const monacoLanguageMap = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    c: 'c',
    cpp: 'cpp',
    java: 'java',
    go: 'go',
    ruby: 'ruby',
    rust: 'rust',
    csharp: 'csharp',
    swift: 'swift',
    kotlin: 'kotlin',
    dart: 'dart',
    r: 'r',
    php: 'php',
    sql: 'sql',
    html: 'html'
  };

  // 🔌 Lifecycle Hook: Listen for incoming text and cursor movements from the WebSocket server
  useEffect(() => {
    if (!socket) return;

    // Listen for code adjustments broadcasted by peers
    socket.on('code-update', (updatedCode) => {
      if (editorRef.current && updatedCode !== editorRef.current.getValue()) {
        const model = editorRef.current.getModel();
        if (model) {
          // Push an edit operation instead of setValue to preserve undo/redo history stacks!
          model.pushEditOperations(
            editorRef.current.getSelections(),
            [{ range: model.getFullModelRange(), text: updatedCode }],
            () => null
          );
        }
      }
    });

    // Listen for peer cursor tracks inside the workspace room
    socket.on('cursor-update', ({ username, position }) => {
      if (!editorRef.current || !position) return;

      const monaco = window.monaco;
      if (!monaco) return;

      // Clear out older cursor positioning pointers for this specific user stream
      const currentDecorations = decorationsRef.current;

      const newDecorations = editorRef.current.deltaDecorations(
        currentDecorations,
        [
          {
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column + 1
            ),
            options: {
              className: 'peer-cursor-line',
              beforeContentClassName: 'peer-cursor-widget',
              hoverMessage: { value: `**${username}** is editing here` }
            }
          }
        ]
      );

      decorationsRef.current = newDecorations;
    });

    return () => {
      socket.off('code-update');
      socket.off('cursor-update');
    };
  }, [socket]);

  // Handle local typing modifications inside Monaco editor frames
  const handleEditorChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit('code-change', { roomId, code: value });
    }
  };

  // Keep track of active editing coordinates and broadcast to teammates
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Listen to cursor position movements
    editor.onDidChangeCursorPosition((e) => {
      if (socket) {
        socket.emit('cursor-move', {
          roomId,
          position: e.position
        });
      }
    });
  };

  return (
    <div className="flex-1 h-full border-r border-zinc-800 bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={monacoLanguageMap[language] || 'javascript'}
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
          minimap: { enabled: true },
          automaticLayout: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 16 },
          smoothScrolling: true
        }}
      />
    </div>
  );
}