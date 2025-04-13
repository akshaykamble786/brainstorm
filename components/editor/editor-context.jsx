"use client";

import React, { createContext, useContext, useRef } from "react";

const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const editorRef = useRef(null);

  return (
    <EditorContext.Provider value={editorRef}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
} 