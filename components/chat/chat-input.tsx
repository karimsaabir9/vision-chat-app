"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload, type PendingImage } from "./image-upload";
import { Send, Square } from "lucide-react";

type ChatStatus = "submitted" | "streaming" | "ready" | "error";

interface ChatInputProps {
  status: ChatStatus;
  onSend: (text: string, image: PendingImage | null) => void;
  onStop: () => void;
}

export function ChatInput({ status, onSend, onStop }: ChatInputProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<PendingImage | null>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const canSend = (text.trim().length > 0 || image !== null) && !isBusy;

  const handleSubmit = () => {
    if (!canSend) return;
    onSend(text.trim(), image);
    setText("");
    setImage(null);
  };

  return (
    <div className="border-t border-gray-100 p-4 space-y-3">
      <ImageUpload image={image} onImageChange={setImage} disabled={isBusy} />

      <div className="flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask something about the image..."
          disabled={isBusy}
          rows={2}
          className="resize-none"
        />

        {isBusy ? (
          <Button type="button" variant="outline" size="icon" onClick={onStop}>
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" size="icon" onClick={handleSubmit} disabled={!canSend}>
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
