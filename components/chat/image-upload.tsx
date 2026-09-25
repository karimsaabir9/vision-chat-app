"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PendingImage {
  dataUrl: string;
  mediaType: string;
  filename: string;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

interface ImageUploadProps {
  image: PendingImage | null;
  onImageChange: (image: PendingImage | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ image, onImageChange, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      setError(null);

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Only image files are supported.");
        return;
      }

      if (file.size > MAX_IMAGE_BYTES) {
        setError("Image must be smaller than 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onImageChange({
          dataUrl: reader.result as string,
          mediaType: file.type,
          filename: file.name,
        });
      };
      reader.onerror = () => setError("Could not read that file.");
      reader.readAsDataURL(file);
    },
    [onImageChange],
  );

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {image ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.dataUrl}
            alt={image.filename}
            className="h-20 w-20 rounded-lg object-cover border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onImageChange(null)}
            disabled={disabled}
            aria-label="Remove image"
            className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full h-5 w-5 flex items-center justify-center"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className={isDragging ? "border-blue-400 bg-blue-50" : ""}
            aria-label="Attach an image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
