"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { templates, templateCategories } from "@/lib/templates/templates";
import { Crown } from "lucide-react";
import { Badge } from "../ui/badge";
import UseSubscription from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";
import { useEditor } from "@/components/editor/editor-context";

export function TemplatesDialog({ trigger }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const editorRef = useEditor();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>
            Select a template to quickly start your document
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="all" className="mt-2">
          <TabsList className="mb-4">
            {templateCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {templateCategories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="mt-0 flex-1 overflow-hidden"
            >
              <ScrollArea
                className="flex-1 pr-4 overflow-y-auto"
                style={{ maxHeight: "calc(85vh - 180px)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {templates
                    .filter((template) =>
                      template.categories.includes(category.id)
                    )
                    .map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        editor={editorRef.current}
                        onSelect={() => setOpen(false)}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function TemplateCard({ template, editor, onSelect }) {
  const { hasActiveSubscription } = UseSubscription();
  const { toast } = useToast();
  const isProTemplate = template.status === "Pro";
  const isDisabled = isProTemplate && !hasActiveSubscription;

  const handleTemplateSelect = () => {
    if (!editor) {
      toast({
        title: "Editor not found",
        variant: "destructive",
      });
      return;
    }

    try {
      editor.commands.clearContent();
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = template.content;

      const processTextNode = (node) => {
        const marks = [];
        let parent = node.parentElement;
        
        while (parent && parent !== tempDiv) {
          if (parent.tagName === 'STRONG' || parent.tagName === 'B') {
            marks.push({ type: 'bold' });
          }
          parent = parent.parentElement;
        }
        
        return {
          type: 'text',
          text: node.textContent || '',
          marks: marks.length > 0 ? marks : undefined
        };
      };

      const processNode = (node) => {
        if (!node) return null;

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (!text) return null;
          return processTextNode(node);
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();
          
          switch (tagName) {
            case 'strong':
            case 'b':
              return {
                type: 'text',
                text: node.textContent || '',
                marks: [{ type: 'bold' }]
              };
            case 'br':
              return {
                type: 'hardBreak'
              };
            case 'p':
              const pContent = Array.from(node.childNodes)
                .map(processNode)
                .filter(Boolean);
              return pContent.length > 0 ? {
                type: 'paragraph',
                content: pContent
              } : null;
            default:
              const text = node.textContent?.trim();
              if (!text) return null;
              return processTextNode(node);
          }
        }
        
        return null;
      };

      const processTableCell = (cell) => {
        if (!cell) return [];

        const result = [];
        let currentParagraph = {
          type: 'paragraph',
          content: []
        };

        const flushParagraph = () => {
          if (currentParagraph.content.length > 0) {
            result.push({ ...currentParagraph });
            currentParagraph = {
              type: 'paragraph',
              content: []
            };
          }
        };

        cell.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) {
              currentParagraph.content.push(processTextNode(node));
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            
            if (tagName === 'p') {
              flushParagraph();
              const content = Array.from(node.childNodes)
                .map(processNode)
                .filter(Boolean);
              if (content.length > 0) {
                result.push({
                  type: 'paragraph',
                  content
                });
              }
            } else if (tagName === 'br') {
              flushParagraph();
            } else if (tagName === 'strong' || tagName === 'b') {
              currentParagraph.content.push({
                type: 'text',
                text: node.textContent || '',
                marks: [{ type: 'bold' }]
              });
            } else {
              const text = node.textContent?.trim();
              if (text) {
                currentParagraph.content.push(processTextNode(node));
              }
            }
          }
        });

        flushParagraph();
        return result.length > 0 ? result : [{ type: 'paragraph' }];
      };

      const content = Array.from(tempDiv.childNodes).map(node => {
        if (!node) return null;

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (!text) return null;
          return {
            type: 'paragraph',
            content: [processTextNode(node)]
          };
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();
          
          switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
              const headingContent = Array.from(node.childNodes)
                .map(processNode)
                .filter(Boolean);
              return headingContent.length > 0 ? {
                type: 'heading',
                attrs: { level: parseInt(tagName[1]) },
                content: headingContent
              } : null;
            case 'p':
              const pContent = Array.from(node.childNodes)
                .map(processNode)
                .filter(Boolean);
              return pContent.length > 0 ? {
                type: 'paragraph',
                content: pContent
              } : null;
            case 'ul':
              const ulContent = Array.from(node.children)
                .map(li => {
                  const liContent = Array.from(li.childNodes)
                    .map(processNode)
                    .filter(Boolean);
                  return liContent.length > 0 ? {
                    type: 'listItem',
                    content: [{
                      type: 'paragraph',
                      content: liContent
                    }]
                  } : null;
                })
                .filter(Boolean);
              return ulContent.length > 0 ? {
                type: 'bulletList',
                content: ulContent
              } : null;
            case 'ol':
              const olContent = Array.from(node.children)
                .map(li => {
                  const liContent = Array.from(li.childNodes)
                    .map(processNode)
                    .filter(Boolean);
                  return liContent.length > 0 ? {
                    type: 'listItem',
                    content: [{
                      type: 'paragraph',
                      content: liContent
                    }]
                  } : null;
                })
                .filter(Boolean);
              return olContent.length > 0 ? {
                type: 'orderedList',
                content: olContent
              } : null;
            case 'table':
              const rows = Array.from(node.children)
                .filter(child => child.tagName.toLowerCase() === 'tr')
                .map(row => ({
                  type: 'tableRow',
                  content: Array.from(row.children).map(cell => {
                    const cellType = cell.tagName.toLowerCase() === 'th' ? 'tableHeader' : 'tableCell';
                    return {
                      type: cellType,
                      content: processTableCell(cell)
                    };
                  })
                }));
              
              if (rows.length === 0) return null;
              
              return {
                type: 'table',
                content: rows
              };
            default:
              const text = node.textContent?.trim();
              if (!text) return null;
              return {
                type: 'paragraph',
                content: [processTextNode(node)]
              };
          }
        }
        
        return null;
      }).filter(Boolean);

      if (content.length === 0) {
        throw new Error("No content was generated from the template");
      }

      editor.commands.setContent(content);
      editor.commands.focus();

      toast({
        title: "Template applied",
        variant: "success",
      });
      
      onSelect?.();
    } catch (error) {
      console.error("Template processing error:", error);
      toast({
        title: "Error applying template",
        description: error.message || "Failed to apply the template",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      className={cn(
        "group flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDisabled && "opacity-60 cursor-not-allowed hover:bg-transparent border-yellow-500"
      )}
      onClick={() => !isDisabled && handleTemplateSelect()}
      disabled={isDisabled}
    >
      <div className="flex items-center justify-between w-full">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md border",
            "bg-background group-hover:border-primary",
            isDisabled && "group-hover:border-muted"
          )}
        >
          <template.icon className="h-5 w-5" />
        </div>
        {template.status === "Pro" && (
          <Badge
            variant={hasActiveSubscription ? "default" : "default"}
            className="ml-2 border-yellow-500"
          >
            {isDisabled && <Crown className="size-4 mr-1" />}
            Pro
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">{template.name}</h3>
        <p className="text-sm text-muted-foreground">
          {isDisabled
            ? "Upgrade to Pro to use this template"
            : template.description}
        </p>
      </div>
    </button>
  );
}