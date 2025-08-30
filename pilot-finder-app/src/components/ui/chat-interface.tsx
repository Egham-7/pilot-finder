"use client";

import type { ChatRequestOptions, ChatStatus, UIMessage } from "ai";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Edit3,
  Mic,
  Paperclip,
  RefreshCcw,
  Square,
  Trash2,
  X,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Action, Actions } from "@/components/actions";
// Import AI Elements components
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/conversation";
import { Loader } from "@/components/loader";
import { Message as AIMessage, MessageContent } from "@/components/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/reasoning";
import { Response } from "@/components/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/tool";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: UIMessage[];
  sendMessage: (
    message?: { text: string; files?: FileList },
    options?: ChatRequestOptions,
  ) => Promise<void>;
  status: ChatStatus;
  stop: () => Promise<void>;
  initialMessage: string;
  initialFiles?: FileList;
  regenerate?: () => Promise<void>;
  setMessages?: (
    messages: UIMessage[] | ((prev: UIMessage[]) => UIMessage[]),
  ) => void;
}

export function ChatInterface({
  messages,
  sendMessage,
  status,
  stop,
  initialMessage,
  initialFiles,
  regenerate,
  setMessages,
}: ChatInterfaceProps) {
  const hasInitialMessageSent = useRef(false);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(initialFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  useEffect(() => {
    // Auto-send the initial message when component mounts
    if (
      initialMessage.trim() &&
      !hasInitialMessageSent.current &&
      status === "ready"
    ) {
      hasInitialMessageSent.current = true;
      sendMessage({
        text: initialMessage,
        files: initialFiles,
      });
    }
  }, [initialMessage, initialFiles, sendMessage, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      await sendMessage({
        text: input,
        files: files,
      });
      setInput("");
      setFiles(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files || undefined);
  };

  const removeFile = (index: number) => {
    if (files) {
      const dt = new DataTransfer();
      Array.from(files).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setFiles(dt.files.length > 0 ? dt.files : undefined);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy message");
    }
  };

  const deleteMessage = (messageId: string) => {
    if (!setMessages) return;

    setMessages((currentMessages) => {
      const messageIndex = currentMessages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return currentMessages;

      // Remove the message and all subsequent messages
      return currentMessages.slice(0, messageIndex);
    });

    toast.success("Message deleted");
  };

  const startEditMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditingText(currentText);
  };

  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleVoiceTranscription = async (text: string) => {
    setShowVoiceInput(false);
    if (text.trim()) {
      setInput(text.trim());
    }
  };

  const handleVoiceError = (error: string) => {
    setShowVoiceInput(false);
    toast.error(error);
  };

  const saveEditMessage = async (messageId: string) => {
    if (!setMessages || !editingText.trim()) return;

    setMessages((currentMessages) => {
      const messageIndex = currentMessages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return currentMessages;

      // Remove the current message and all messages after it
      return currentMessages.slice(0, messageIndex);
    });

    setEditingMessageId(null);
    setEditingText("");

    // Send the edited message as a new message
    await sendMessage({ text: editingText.trim() });
  };

  // Don't show initial message in the display since it will be sent as a real message
  const allMessages = messages;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept=".pdf,.doc,.docx,.txt,.csv,.json,.md,image/*"
        className="hidden"
      />

      {/* Background decoration */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
      </div>

      {/* Chat Interface using AI Elements */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Stop button floating when streaming */}
        {status === "streaming" && (
          <motion.div
            className="absolute top-4 right-4 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <button
              type="button"
              onClick={stop}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full border border-destructive/20 backdrop-blur-xl shadow-lg transition-all"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          </motion.div>
        )}

        <Conversation className="flex-1 pt-8">
          <ConversationContent className="max-w-4xl mx-auto px-4 pb-4">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {allMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AIMessage
                    from={message.role}
                    className={cn(
                      "mb-8 group",
                      message.role === "user" && "ml-auto max-w-3xl",
                      message.role === "assistant" && "max-w-4xl",
                    )}
                  >
                    <MessageContent
                      className={cn(
                        "rounded-2xl p-6 shadow-sm",
                        message.role === "user"
                          ? "bg-primary/10 border border-primary/20 text-foreground/90"
                          : "bg-card/80 border border-border/50 text-foreground/90 backdrop-blur-sm",
                      )}
                    >
                      {message.parts?.map((part, i) => {
                        if (part.type === "text") {
                          const isLastMessage = index === messages.length - 1;
                          const isEditing = editingMessageId === message.id;

                          if (isEditing) {
                            return (
                              <div
                                key={`${message.id}-part-${i}`}
                                className="space-y-3"
                              >
                                <Textarea
                                  value={editingText}
                                  onChange={(e) =>
                                    setEditingText(e.target.value)
                                  }
                                  className="min-h-[100px] resize-none"
                                  placeholder="Edit your message..."
                                />
                                <div className="flex gap-2">
                                  <Action
                                    onClick={() => saveEditMessage(message.id)}
                                    tooltip="Save changes"
                                    label="Save"
                                    variant="default"
                                    size="sm"
                                  >
                                    <Check className="w-3 h-3" />
                                  </Action>
                                  <Action
                                    onClick={cancelEditMessage}
                                    tooltip="Cancel editing"
                                    label="Cancel"
                                    variant="outline"
                                    size="sm"
                                  >
                                    <X className="w-3 h-3" />
                                  </Action>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={`${message.id}-part-${i}`}>
                              <Response className="text-foreground/90 leading-relaxed">
                                {part.text}
                              </Response>
                              {/* Show actions only on hover */}
                              <Actions className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Action
                                  onClick={() => copyToClipboard(part.text)}
                                  tooltip="Copy message"
                                  label="Copy"
                                >
                                  <Copy className="w-3 h-3" />
                                </Action>

                                {/* Edit action for user messages */}
                                {message.role === "user" && setMessages && (
                                  <Action
                                    onClick={() =>
                                      startEditMessage(message.id, part.text)
                                    }
                                    tooltip="Edit message"
                                    label="Edit"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Action>
                                )}

                                {/* Delete action */}
                                {setMessages && (
                                  <Action
                                    onClick={() => deleteMessage(message.id)}
                                    tooltip="Delete message and all after"
                                    label="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Action>
                                )}

                                {/* Regenerate for assistant messages */}
                                {message.role === "assistant" &&
                                  regenerate &&
                                  isLastMessage && (
                                    <Action
                                      onClick={() => regenerate()}
                                      tooltip="Regenerate response"
                                      label="Regenerate"
                                    >
                                      <RefreshCcw className="w-3 h-3" />
                                    </Action>
                                  )}
                              </Actions>
                            </div>
                          );
                        }

                        if (part.type === "reasoning") {
                          const isLastMessage = index === messages.length - 1;
                          const isCurrentlyStreaming =
                            status === "streaming" && isLastMessage;

                          return (
                            <Reasoning
                              key={`${message.id}-reasoning-${i}`}
                              className="w-full mb-4"
                              isStreaming={isCurrentlyStreaming}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        }

                        if (part.type.startsWith("tool-")) {
                          // Type guard to check if this is a ToolUIPart
                          const toolPart = part as {
                            type: `tool-${string}`;
                            toolCallId: string;
                            state:
                              | "input-streaming"
                              | "input-available"
                              | "output-available"
                              | "output-error";
                            input?: unknown;
                            output?: unknown;
                            errorText?: string;
                            providerExecuted?: boolean;
                          };
                          return (
                            <Tool
                              key={`${message.id}-tool-${i}`}
                              className="mb-4"
                            >
                              <ToolHeader
                                type={toolPart.type}
                                state={toolPart.state || "output-available"}
                              />
                              <ToolContent>
                                <ToolInput input={toolPart.input} />
                                <ToolOutput
                                  output={toolPart.output as React.ReactNode}
                                  errorText={toolPart.errorText}
                                />
                              </ToolContent>
                            </Tool>
                          );
                        }

                        if (
                          part.type === "file" &&
                          part.mediaType?.startsWith("image/")
                        ) {
                          return (
                            <Image
                              key={`${message.id}-file-${i}`}
                              src={part.url}
                              alt={part.filename || "Attached image"}
                              className="max-w-sm rounded-lg border border-border/50 my-2"
                              width={400}
                              height={300}
                            />
                          );
                        }

                        if (part.type === "file") {
                          return (
                            <div
                              key={`${message.id}-file-${i}`}
                              className="flex items-center gap-2 text-sm bg-card/50 py-2 px-3 rounded-lg text-muted-foreground border border-border/50 my-2"
                            >
                              <Paperclip className="w-4 h-4" />
                              <span className="font-medium">
                                {part.filename}
                              </span>
                              {part.url && (
                                <a
                                  href={part.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Download
                                </a>
                              )}
                            </div>
                          );
                        }

                        return null;
                      })}
                    </MessageContent>
                  </AIMessage>
                </motion.div>
              ))}

              {status === "submitted" && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <AIMessage from="assistant">
                    <MessageContent className="bg-card/80 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
                      <Loader />
                    </MessageContent>
                  </AIMessage>
                </motion.div>
              )}
            </motion.div>
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input area using AI Elements */}
        <motion.div
          className="p-6 bg-background/80 backdrop-blur-xl border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Voice Input Mode */}
            {showVoiceInput ? (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AIVoiceInput
                  onTranscription={handleVoiceTranscription}
                  onError={handleVoiceError}
                  className="py-2"
                />
                <div className="flex justify-center mt-2">
                  <button
                    type="button"
                    onClick={() => setShowVoiceInput(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Switch to text input
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Text Input Mode */
              <PromptInput
                onSubmit={handleSubmit}
                className="backdrop-blur-xl bg-card/40 rounded-3xl border border-border/60 focus-within:border-primary/40 focus-within:bg-card/60 transition-all shadow-lg hover:shadow-xl"
              >
                {/* Show attached files */}
                {files && files.length > 0 && (
                  <motion.div
                    className="p-4 pb-0"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex gap-2 flex-wrap">
                      {Array.from(files).map((file, index) => (
                        <motion.div
                          key={`${file.name}-${index}`}
                          className="flex items-center gap-2 text-xs bg-card/50 py-1.5 px-3 rounded-lg text-muted-foreground border border-border/50"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <div className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            <span className="font-medium">{file.name}</span>
                            <span className="text-muted-foreground/70">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 hover:bg-card/80 rounded"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <PromptInputTextarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your pilot customer discovery..."
                  disabled={status === "streaming" || status === "submitted"}
                  className={cn(
                    "bg-transparent text-foreground/90 placeholder:text-muted-foreground border-none resize-none min-h-[80px] max-h-[200px] px-6 py-4 text-base leading-relaxed",
                    (status === "submitted" || status === "streaming") &&
                      "opacity-50 cursor-not-allowed",
                  )}
                />
                <PromptInputToolbar className="px-6 pb-4 pt-0">
                  <PromptInputTools>
                    <PromptInputButton
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="w-4 h-4" />
                      Attach
                    </PromptInputButton>
                    <PromptInputButton onClick={() => setShowVoiceInput(true)}>
                      <Mic className="w-4 h-4" />
                      Voice
                    </PromptInputButton>
                  </PromptInputTools>
                  <div className="flex justify-end">
                    <PromptInputSubmit
                      disabled={
                        !input.trim() ||
                        status === "submitted" ||
                        status === "streaming"
                      }
                      status={status}
                      className={cn(
                        "rounded-2xl transition-all px-6 py-3 font-medium shadow-sm",
                        input.trim() && status === "ready"
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:shadow-lg"
                          : "bg-muted text-muted-foreground",
                      )}
                    />
                  </div>
                </PromptInputToolbar>
              </PromptInput>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
