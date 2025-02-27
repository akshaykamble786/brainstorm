import React, { useRef, useState } from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentInfo from "./DocumentInfo";
import { Loader2Icon } from "lucide-react";
import { Editor } from "@/components/editor/editor";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import { Chat } from "./Chat";

const DocumentEditor = ({ params }) => {
  const [charsCount, setCharsCount] = useState(0);
  const [documentContent, setDocumentContent] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef(null);

  const handleEditorReady = (editor) => {
    editorRef.current = editor;
    setIsEditorReady(true);
  };

  return (
    <div className="relative">
      <DocumentHeader
        charsCount={charsCount}
        editorContent={{
          text: documentContent.text,
          editor: editorRef.current,
        }}
      />
      <DocumentInfo
        params={params}
        editor={editorRef.current}
        isEditorReady={isEditorReady}
      />
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <ClientSideSuspense
            fallback={<Loader2Icon className="animate-spin" />}
          >
            <Editor
              setCharsCount={setCharsCount}
              onContentChange={(content) => setDocumentContent(content)}
              onEditorReady={handleEditorReady}
            />
          </ClientSideSuspense>
        </div>
      </div>
      <Chat
        editorContent={{
          text: documentContent.text,
          editor: editorRef.current,
        }}
      />
    </div>
  );
};

export default DocumentEditor;
