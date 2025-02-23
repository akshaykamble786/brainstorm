"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Paperclip,
  Send,
  StopCircle,
  Edit,
  Clipboard,
  SunMediumIcon,
  ExternalLinkIcon,
  PenIcon,
  BoxSelect,
  Check,
  ArrowDownCircleIcon,
  WandSparkles,
  Plus,
  Trash2,
  ArrowLeftIcon,
  Clock10Icon,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { chatService } from "@/lib/chat-service";
import { rateLimitService } from "@/lib/rate-limit";
import { ToastAction } from "@/components/ui/toast";
import UseSubscription from "@/hooks/use-subscription";

export function Chat({ editorContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [documentContext, setDocumentContext] = useState("");
  const [suggestedQuery, setSuggestedQuery] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollAreaRef = useRef(null);
  const lastMessageRef = useRef(null);

  const { user } = useUser();
  const { toast } = useToast();
  const { hasActiveSubscription } = UseSubscription();

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      documentContext: documentContext,
    },
    onResponse: async (response) => {
      if (currentChatId) {
        const updatedMessages = [
          ...messages,
          {
            id: `msg-${Date.now()}-user`,
            role: "user",
            content: input,
            createdAt: Date.now(),
          },
        ];
        await chatService.updateChat(currentChatId, updatedMessages);
      }
    },
    onFinish: async (message) => {
      if (currentChatId) {
        const updatedMessages = [
          ...messages,
          {
            id: `msg-${Date.now()}-user`,
            role: "user",
            content: input,
            createdAt: Date.now(),
          },
          message,
        ];
        await chatService.updateChat(currentChatId, updatedMessages);
      }
    },
  });
  useEffect(() => {
    if (editorContent?.text) {
      setDocumentContext(editorContent.text);
    }
  }, [editorContent]);

  useEffect(() => {
    if (suggestedQuery) {
      const submitQuery = async () => {
        try {
          const fakeEvent = {
            preventDefault: () => {},
            target: {
              message: { value: suggestedQuery },
            },
          };
          await handleFormSubmit(fakeEvent);
        } catch (error) {
          console.error("Error submitting suggested query:", error);
          toast({
            title: "Failed to send message",
            description: "Please try again",
            variant: "destructive",
          });
        }
        setSuggestedQuery(null);
      };

      submitQuery();
    }
  }, [suggestedQuery]);

  useEffect(() => {
    if (scrollAreaRef.current && lastMessageRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      if (user && !currentChatId && chats.length === 0) {
        try {
          const initialMessages = [
            {
              id: `msg-${Date.now()}-assistant`,
              role: "assistant",
              content: `Hi ${user.firstName}! How can I help you with your document?`,
              createdAt: Date.now(),
            },
          ];

          const chatId = await chatService.createChat(user.id);
          setCurrentChatId(chatId);

          await chatService.updateChat(chatId, initialMessages);
          setMessages(initialMessages);
        } catch (error) {
          console.error("Error creating initial chat:", error);
          toast({
            title: "Error initializing chat",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
        }
      }
    };

    initializeChat();
  }, [user, currentChatId, chats.length]);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = chatService.subscribeToUserChats(
        user.id,
        (updatedChats) => {
          setChats(updatedChats);
        }
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    const updateChatWithAIResponse = async () => {
      if (currentChatId && messages.length > 0) {
        await chatService.updateChat(currentChatId, messages);
      }
    };
    updateChatWithAIResponse();
  }, [messages, currentChatId]);

  const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return "An error occurred. Please try again.";
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Response copied",
      variant: "success",
    });
  };

  const insertResponse = (content) => {
    if (!editorContent?.editor) {
      toast({
        title: "Editor not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const editor = editorContent.editor;
      editor.commands.clearContent();
      editor.commands.setContent(content);
      editor.commands.focus();

      toast({
        title: "Response inserted",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error inserting response",
        description:
          error.message || "Failed to insert the response into the editor",
        variant: "destructive",
      });
    }
  };

  // const handleSuggestedQuery = async (query) => {
  //   if (!user) {
  //     toast({
  //       title: "Please sign in",
  //       description: "You need to be signed in to use AI features",
  //       variant: "destructive",
  //     });
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
  //           <ToastAction
  //             altText="Upgrade to Pro"
  //             onClick={() => router.push("/pricing")}
  //           >
  //             Upgrade to Pro
  //           </ToastAction>
  //         ),
  //       });
  //       return;
  //     }

  //     setInput(query);
  //     setSuggestedQuery(query);

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
  //       title: "Failed to send message",
  //       description: "Please try again",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleSuggestedQuery = async (query) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to use AI features",
        variant: "destructive",
      });
      return;
    }

    try {
      // Only check rate limit for free tier users
      if (!hasActiveSubscription) {
        const { allowed, remainingMessages } = 
          await rateLimitService.checkAndIncrementUsage(user.id);

        if (!allowed) {
          toast({
            title: "Daily messages limit reached",
            description: "You're out of free messages. Upgrade to more access",
            variant: "destructive",
            action: (
              <ToastAction
                altText="Upgrade to Pro"
                onClick={() => router.push("/pricing")}
              >
                Upgrade to Pro
              </ToastAction>
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

      setInput(query);
      setSuggestedQuery(query);

    } catch (error) {
      console.error("Error checking rate limit:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
  const createNewChat = async () => {
    if (user) {
      const chatId = await chatService.createChat(user.id);
      setCurrentChatId(chatId);
      setMessages([]);
      setShowChatHistory(false);
    }
  };

  const deleteChat = async (chatId) => {
    await chatService.deleteChat(chatId);
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  const selectChat = async (chat) => {
    setCurrentChatId(chat.id);
    if (chat.messages && Array.isArray(chat.messages)) {
      const formattedMessages = chat.messages.map((msg) => ({
        id: msg.id || `msg-${Date.now()}-${Math.random()}`,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt || Date.now(),
      }));
      setMessages(formattedMessages);
    }
    setShowChatHistory(false);
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!user) {
  //     toast({
  //       title: "Please sign in",
  //       description: "You need to be signed in to use AI features",
  //       variant: "destructive",
  //     });
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
  //           <ToastAction
  //             altText="Upgrade to Pro"
  //             onClick={() => router.push("/pricing")}
  //           >
  //             Upgrade to Pro
  //           </ToastAction>
  //         ),
  //       });
  //       return;
  //     }

  //     if (!currentChatId) {
  //       const chatId = await chatService.createChat(user.id);
  //       setCurrentChatId(chatId);
  //     }

  //     // Ensure we're using the original handleSubmit from useChat
  //     await originalHandleSubmit(e);

  //     if (remainingMessages <= 2) {
  //       toast({
  //         title: "Message limit reminder",
  //         description: `You have ${remainingMessages} messages remaining today`,
  //         variant: "default",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     toast({
  //       title: "Failed to send message",
  //       description: "Please try again",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to use AI features",
        variant: "destructive",
      });
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
              <ToastAction
                altText="Upgrade to Pro"
                onClick={() => router.push("/pricing")}
              >
                Upgrade to Pro
              </ToastAction>
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

      if (!currentChatId) {
        const chatId = await chatService.createChat(user.id);
        setCurrentChatId(chatId);
      }

      await originalHandleSubmit(e);

    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed bottom-4 right-4 z-[99]">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button className="rounded-lg">
            <WandSparkles className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[430px] p-0" align="end">
          <div className="flex h-[450px]">
            {showChatHistory ? (
              <div className="w-full p-2">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChatHistory(false)}
                  >
                    <ArrowLeftIcon className="size-4 mr-2" />
                    Back
                  </Button>
                  <span className="text-sm font-normal">Chat History</span>
                  <Button variant="ghost" onClick={createNewChat}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-[440px]">
                  <div className="space-y-2">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => selectChat(chat)}
                      >
                        <span className="truncate">{chat.title}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={createNewChat}>
                    <Plus className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowChatHistory(true)}
                  >
                    <Clock10Icon className="size-4" />
                  </Button>
                </div>

                <ScrollArea
                  ref={scrollAreaRef}
                  className="h-[350px] pr-4 flex-1"
                >
                  <div className="flex flex-col h-[400px]">
                    <div className="w-full mt-3 text-foreground items-center justify-center flex gap-3 p-3">
                      <h2 className="text-md text-left font-normal">
                        Hi {user?.firstName}! How can I help you with your
                        document?
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <h3 className="ml-3 text-sm font-medium text-muted-foreground">
                        This page
                      </h3>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-primary"
                          onClick={() =>
                            handleSuggestedQuery(
                              "Please summarize this document."
                            )
                          }
                        >
                          <SunMediumIcon className="size-4 mr-2" />
                          Summarize this document
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-primary"
                          onClick={() =>
                            handleSuggestedQuery(
                              "What are the main points in this document?"
                            )
                          }
                        >
                          <ExternalLinkIcon className="size-3 mr-2" />
                          Extract main points
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-primary"
                          onClick={() =>
                            handleSuggestedQuery("Fact check this document")
                          }
                        >
                          <Check className="size-3 mr-2" />
                          Fact check this document
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 mt-2 mb-2">
                      <h3 className="ml-3 text-sm text-muted-foreground">
                        Suggested
                      </h3>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-primary"
                          onClick={() =>
                            handleSuggestedQuery("Draft a meeting agenda")
                          }
                        >
                          <PenIcon className="size-3 mr-2" />
                          Draft a meeting agenda
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-primary"
                          onClick={() =>
                            handleSuggestedQuery("Analyze this image")
                          }
                        >
                          <Search className="size-3 mr-2" />
                          Analyze this image
                        </Button>
                      </div>
                    </div>

                    {messages?.map((msg, i) => (
                      <div
                        key={i}
                        ref={i === messages.length - 1 ? lastMessageRef : null}
                        className={`flex flex-col ${
                          msg.role === "user" ? "items-end" : "items-start"
                        } space-y-2 px-4 py-3 text-sm text-foreground`}
                      >
                        <div
                          className={`inline-block p-2 rounded-lg ${
                            msg.role === "user"
                              ? "bg-primary text-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.role === "assistant" && (
                          <div className="flex gap-2 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(msg.content)}
                            >
                              <Clipboard size={16} />
                              Copy
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => insertResponse(msg.content)}
                            >
                              <Edit size={16} />
                              Replace
                            </Button>
                            <Button variant="ghost" size="sm">
                              <BoxSelect size={16} />
                              Create document
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    {error && (
                      <div className="w-full items-center justify-center flex gap-3 p-4">
                        <div className="text-red-500">
                          {getErrorMessage(error)}
                        </div>
                        <ArrowDownCircleIcon
                          onClick={reload}
                          className="size-4"
                        />
                      </div>
                    )}

                    <div className="mt-auto p-4 border-t">
                      <form onSubmit={handleFormSubmit} className="relative">
                        <Input
                          value={input}
                          onChange={handleInputChange}
                          className="flex-1"
                          placeholder="Ask about your document..."
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="size-4"
                            disabled={isLoading}
                          >
                            <Send size={24} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button
                            disabled={!isLoading}
                            onClick={stop}
                            variant="ghost"
                            size="icon"
                            className="size-4"
                          >
                            <StopCircle size={24} />
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}