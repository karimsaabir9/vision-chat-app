"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, RotateCcw } from "lucide-react";

type ChatStatus = "submitted" | "streaming" | "ready" | "error";

interface ChatWindowProps {
  messages: UIMessage[];
  status: ChatStatus;
  error: Error | undefined;
  onRetry: () => void;
}

export function ChatWindow({ messages, status, error, onRetry }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <ScrollArea className="flex-1 min-h-0 p-6">
      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Upload an image and ask a question about it to get started.
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {(status === "submitted" || status === "streaming") && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Bot className="h-4 w-4" />
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            </span>
            {status === "submitted" ? "Thinking..." : "Responding..."}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-red-800 text-sm">{error.message}</p>
            <Button variant="outline" size="sm" onClick={onRetry} className="border-red-200 text-red-600">
              <RotateCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
