import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Streamdown } from "streamdown";
import { Bot, User } from "lucide-react";
import type { UIMessage } from "ai";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarFallback className="bg-blue-100">
            <Bot className="h-3 w-3 text-blue-600" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`rounded-2xl px-4 py-3 max-w-lg ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return isUser ? (
              <span key={i} className="whitespace-pre-wrap text-sm">
                {part.text}
              </span>
            ) : (
              <Streamdown key={i} className="prose prose-sm max-w-none">
                {part.text}
              </Streamdown>
            );
          }

          if (part.type === "file" && part.mediaType.startsWith("image/")) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={part.url}
                alt={part.filename ?? "Uploaded image"}
                className="rounded-lg max-w-xs mt-2 first:mt-0"
              />
            );
          }

          return null;
        })}
      </div>

      {isUser && (
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">
            <User className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
