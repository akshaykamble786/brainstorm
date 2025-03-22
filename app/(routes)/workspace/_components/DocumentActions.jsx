import {
  History,
  ImportIcon,
  MoreHorizontal,
  Sun,
  UploadIcon,
  WholeWord,
  Link2Icon,
  MoonIcon,
  Computer,
  Crown,
  File,
  FileText,
  Github,
  FileBadge,
  FileAxis3D,
} from "lucide-react";
import React, { useCallback, useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import VersionHistory from "@/components/editor/version-history";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import UseSubscription from "@/hooks/use-subscription";
import { useEditor } from "@tiptap/react";
import { defaultExtensions } from "@/components/editor/extensions";
import { Import } from "@tiptap-pro/extension-import";
import { Badge } from "@/components/ui/badge";

const extendedExtensions = [
  ...defaultExtensions,
  Import.configure({
    appId: process.env.NEXT_PUBLIC_TIPTAP_CONVERT_APP_ID || "",
    token: process.env.NEXT_PUBLIC_TIPTAP_CONVERT_JWT || "",
    experimentalDocxImport: true,
  }),
];

export const DocumentActions = ({ charsCount, editorContent }) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme } = useTheme();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { toast } = useToast();
  const { hasActiveSubscription } = UseSubscription();
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: extendedExtensions,
    content: editorContent || "<p></p>",
  });

  const handleCopyLink = () => {
    const link = `brainstormm.vercel.app/workspace/${params.workspaceId}/${params.documentId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          variant: "success",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const getWordCount = () => {
    if (!charsCount) return 0;
    return Math.ceil(charsCount);
  };

  const handleHistoryClick = () => {
    setIsHistoryOpen(true);
  };

  const createExport = useCallback(
    (format) => async () => {
      if (!editor) return;

      try {
        setIsLoading(true);
        await editor.commands.export({
          format,
          onExport: (exportData) => {
            const blob = new Blob([exportData.content], {
              type: exportData.mimeType,
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `document.${format}`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setIsLoading(false);
          },
        });
      } catch (error) {
        console.error("Export failed:", error);
        setIsLoading(false);
        toast({
          title: "Export failed",
          description: "There was an error exporting your document.",
          variant: "destructive",
        });
      }
    },
    [editor, toast]
  );

  const handleImport = async (fileType) => {
    if (!editor || !hasActiveSubscription) return;

    if (fileInputRef.current) {
      switch (fileType) {
        case "docx":
          fileInputRef.current.accept = ".docx";
          break;
        case "pdf":
          fileInputRef.current.accept = ".pdf";
          break;
        case "markdown":
          fileInputRef.current.accept = ".md,.markdown";
          break;
        case "odt":
          fileInputRef.current.accept = ".odt";
          break;
        case "rtf":
          fileInputRef.current.accept = ".rtf";
          break;
        default:
          fileInputRef.current.accept = ".docx,.odt,.rtf,.md,.markdown";
      }

      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file || !editor) return;

    try {
      setIsLoading(true);

      await editor
        .chain()
        .focus()
        .import({
          file,
          onImport: (context) => {
            const { setEditorContent, content, error } = context;

            if (error) {
              console.error("Import error:", error);
              setIsLoading(false);
              return;
            }

            setEditorContent();

            toast({
              title: "Import successful",
              description: `${file.name} has been imported successfully.`,
              variant: "success",
            });

            setIsLoading(false);
          },
        })
        .run();
    } catch (error) {
      console.error("Import failed:", error);
      setIsLoading(false);
    }

    event.target.value = "";
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Link2Icon className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Computer className="mr-2 h-4 w-4" />
              Change Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <MoonIcon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UploadIcon className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={createExport("docx")}>
                <FileText className="mr-2 h-4 w-4" />
                Word
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoading || !hasActiveSubscription}
                onClick={createExport("pdf")}
              >
                <FileText className="mr-2 h-4 w-4" />
                PDF
                {!hasActiveSubscription && (
                  <Badge variant="default" className="ml-auto border-yellow-500">
                    <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                    Pro
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={createExport("md")}>
                <File className="mr-2 h-4 w-4" />
                Markdown
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoading || !hasActiveSubscription}
                onClick={createExport("odt")}
              >
                <FileBadge className="mr-2 h-4 w-4" />
                ODT
                {!hasActiveSubscription && (
                  <Badge variant="default" className="ml-auto border-yellow-500">
                    <Crown className="h-3 w-3 mr-1  text-yellow-500" />
                    Pro
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoading || !hasActiveSubscription}
                onClick={createExport("gfm")}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub Markdown
                {!hasActiveSubscription && (
                  <Badge variant="default" className="ml-3 border-yellow-500">
                    <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                    Pro
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ImportIcon className="mr-2 h-4 w-4" />
              Import
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleImport("docx")}>
                <FileText className="mr-2 h-4 w-4" />
                Word
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoading || !hasActiveSubscription}
                onClick={() => handleImport("pdf")}
              >
                <File className="mr-2 h-4 w-4" />
                PDF
                {!hasActiveSubscription && (
                  <Badge variant="default" className="ml-auto border-yellow-500">
                    <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                    Pro
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoading || !hasActiveSubscription}
                onClick={() => handleImport("odt")}
              >
                <FileAxis3D className="mr-2 h-4 w-4" />
                ODT
                {!hasActiveSubscription && (
                  <Badge variant="default" className="ml-auto border-yellow-500">
                    <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                    Pro
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleImport("markdown")}>
                <FileBadge className="mr-2 h-4 w-4" />
                Markdown
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoading || !hasActiveSubscription}
                onClick={() => handleImport("markdown")}
              >
                <Github className="mr-2 h-4 w-4" />
                Github Markdown
                {!hasActiveSubscription && (
                  <Badge variant="default" className="ml-3 border-yellow-500">
                    <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                    Pro
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isLoading || !hasActiveSubscription}
            onClick={handleHistoryClick}
          >
            <History className="mr-2 h-4 w-4" />
            Document History
            {!hasActiveSubscription && (
              <Badge variant="default" className="ml-3 border-yellow-500">
                <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                Pro
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <WholeWord className="mr-2 h-4 w-4" />
            Word Count: {getWordCount()}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <VersionHistory
        isOpen={isHistoryOpen}
        setOpen={setIsHistoryOpen}
        editor={editor}
      />
    </>
  );
};
