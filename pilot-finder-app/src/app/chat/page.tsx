"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";
import { ChatInterface } from "@/components/ui/chat-interface";

export default function ChatPage() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
  const [initialFiles, setInitialFiles] = useState<FileList | undefined>();

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: () => {
      // Chat message completed
    },
  });

  const handleStartChat = async (message: string, files?: File[]) => {
    setInitialMessage(message);

    // Convert File[] to FileList if files exist
    if (files && files.length > 0) {
      // Create a DataTransfer object to build a FileList
      const dt = new DataTransfer();
      files.forEach((file) => dt.items.add(file));
      setInitialFiles(dt.files);
    }

    setHasStartedChat(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!hasStartedChat ? (
          <motion.div
            key="animated-chat"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AnimatedAIChat onSendMessage={handleStartChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat-interface"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen"
          >
            <ChatInterface
              messages={chat.messages}
              sendMessage={chat.sendMessage}
              status={chat.status}
              stop={chat.stop}
              regenerate={chat.regenerate}
              setMessages={chat.setMessages}
              initialMessage={initialMessage}
              initialFiles={initialFiles}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
