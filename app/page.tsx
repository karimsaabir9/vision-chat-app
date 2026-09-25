"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type FileUIPart } from "ai";
import { Card } from "@/components/ui/card";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatInput } from "@/components/chat/chat-input";
import type { PendingImage } from "@/components/chat/image-upload";

export default function Home() {
  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSend = (text: string, image: PendingImage | null) => {
    const files: FileUIPart[] | undefined = image
      ? [
          {
            type: "file",
            mediaType: image.mediaType,
            url: image.dataUrl,
            filename: image.filename,
          },
        ]
      : undefined;

    sendMessage({ text, files });
  };

  return (
    <Card className="flex flex-col h-screen max-w-3xl mx-auto rounded-none sm:rounded-2xl sm:my-6 sm:h-[calc(100vh-3rem)] overflow-hidden py-0 gap-0">
      <header className="border-b border-gray-100 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Vision Chat</h1>
        <p className="text-sm text-gray-500">
          Chat with a local vision model via LM Studio
        </p>
      </header>

      <ChatWindow
        messages={messages}
        status={status}
        error={error}
        onRetry={() => regenerate()}
      />
      <ChatInput status={status} onSend={handleSend} onStop={stop} />
    </Card>
  );
}
