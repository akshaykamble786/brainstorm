"use client";

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/editor/ui/command";
import { useCompletion } from "ai/react";
import { ArrowLeft, ArrowUp, Loader2Icon, SparkleIcon } from "lucide-react";
import { useEditor } from "novel";
import { addAIHighlight } from "novel/extensions";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import AICompletionCommands from "./ai-completion-command";
import AISelectorCommands from "./ai-selector-commands";
import { languages, proses } from "./prompts";
import { rateLimitService } from "@/lib/rate-limit";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import UseSubscription from "@/hooks/use-subscription";

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ViewState = "main" | "languages" | "prose";

export function AISelector({ onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");
  const [currentView, setCurrentView] = useState<ViewState>("main");
  const [selectedOption, setSelectedOption] = useState("");

  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const { hasActiveSubscription } = UseSubscription();

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/generate",
    onResponse: async (response) => {
      if (response.status === 429) {
        return;
      }
    },
    onError: (e) => {},
  });

  const hasCompletion = completion.length > 0;

  // const checkRateLimitAndComplete = async (text: string, options: any) => {
  //   if (!user) {
  //     return;
  //   }

  //   try {
  //     const { allowed, remainingMessages } =
  //       await rateLimitService.checkAndIncrementUsage(user.id);

  //     if (!allowed) {
  //       toast({
  //         title: "Daily messages limit reached",
  //         description: "You're out of free messages. Upgrade to more access",
  //         variant: "destructive",
  //         action: (
  //           <Button
  //             variant="link"
  //             onClick={() => router.push("/pricing")}
  //           >
  //             Upgrade to Pro
  //           </Button>
  //         ),
  //       });
  //       return;
  //     }

  //     await complete(text, options);

  //     if (remainingMessages <= 2) {
  //       toast({
  //         title: "Message limit reminder",
  //         description: `You have ${remainingMessages} messages remaining today`,
  //         variant: "default",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error checking rate limit:", error);
  //     toast({
  //       title: "error",
  //     });
  //   }
  // };

  const checkRateLimitAndComplete = async (text: string, options: any) => {
    if (!user) {
      return;
    }

    try {
      if (!hasActiveSubscription) {
        const { allowed, remainingMessages } = 
          await rateLimitService.checkAndIncrementUsage(user.id);

        if (!allowed) {
          toast({
            title: "Daily messages limit reached",
            description: "You're out of free messages. Upgrade to more access",
            variant: "destructive",
            action: (
              <Button
                variant="ghost"
                onClick={() => router.push("/pricing")}
              >
                Upgrade to Pro
              </Button>
            ),
          });
          return;
        }

        if (remainingMessages <= 2) {
          toast({
            title: "Message limit reminder",
            description: `You have ${remainingMessages} messages remaining today`,
            variant: "default",
          });
        }
      }

      await complete(text, options);

    } catch (error) {
      console.error("Error checking rate limit:", error);
      toast({
        title: "error",
      });
    }
  };
  
  const handleOptionSelect = async (value: string, option: string) => {
    if (option === "translate") {
      setSelectedOption("translate");
      setCurrentView("languages");
    } else if (option === "prose") {
      setSelectedOption("prose");
      setCurrentView("prose");
    } else {
      await checkRateLimitAndComplete(value, { body: { option } });
    }
  };

  const handleSubOptionSelect = async (value: string, subOption: string) => {
    if (selectedOption === "translate") {
      await checkRateLimitAndComplete(value, {
        body: {
          option: "zap",
          command: `Translate this text to ${subOption}`,
        },
      });
    } else if (selectedOption === "prose") {
      await checkRateLimitAndComplete(value, {
        body: {
          option: "zap",
          command: `Rewrite this text in a ${subOption.toLowerCase()} tone`,
        },
      });
    }
    setCurrentView("main");
  };

  return (
    <Command className="w-[350px]">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose dark:prose-invert p-2 px-4 prose-sm">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
        </div>
      )}

      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
          <SparkleIcon className="mr-2 h-4 w-4 shrink-0" />
          AI is thinking
          <div className="ml-2 mt-1">
            <Loader2Icon className="animate-spin" />
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {currentView === "main" && (
            <>
              <div className="relative">
                <CommandInput
                  value={inputValue}
                  onValueChange={setInputValue}
                  autoFocus
                  placeholder={
                    hasCompletion
                      ? "Tell AI what to do next"
                      : "Ask AI to edit or generate..."
                  }
                  onFocus={() => {
                    if (!editor) return;
                    addAIHighlight(editor);
                  }}
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
                  onClick={async () => {
                    if (!editor) return;

                    if (completion) {
                      await checkRateLimitAndComplete(completion, {
                        body: { option: "zap", command: inputValue },
                      }).then(() => setInputValue(""));
                      return;
                    }

                    const slice = editor.state.selection.content();
                    const text = editor.storage.markdown.serializer.serialize(
                      slice.content
                    );

                    await checkRateLimitAndComplete(text, {
                      body: { option: "zap", command: inputValue },
                    }).then(() => setInputValue(""));
                  }}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
              {hasCompletion ? (
                <AICompletionCommands
                  onDiscard={() => {
                    if (!editor) return;
                    editor.chain().unsetHighlight().focus().run();
                    onOpenChange(false);
                  }}
                  completion={completion}
                />
              ) : (
                <AISelectorCommands onSelect={handleOptionSelect} />
              )}
            </>
          )}

          {(currentView === "languages" || currentView === "prose") && (
            <>
              <div className="flex items-center border-b px-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentView("main")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-sm font-medium ml-2">
                  {currentView === "languages"
                    ? "Select Language"
                    : "Select Style"}
                </h2>
              </div>
              <CommandList>
                {(currentView === "languages" ? languages : proses).map(
                  (item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={(value) => {
                        if (!editor) return;
                        const slice = editor.state.selection.content();
                        const text =
                          editor.storage.markdown.serializer.serialize(
                            slice.content
                          );
                        handleSubOptionSelect(text, value);
                      }}
                    >
                      {item}
                    </CommandItem>
                  )
                )}
              </CommandList>
            </>
          )}
        </>
      )}
    </Command>
  );
}