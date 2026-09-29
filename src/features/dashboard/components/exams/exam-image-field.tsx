"use client";

import { useRef, useState } from "react";
import { Download, Trash2, UploadCloud } from "lucide-react";

type Picked = { url: string; name: string; size?: number };

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function nameFromUrl(url: string) {
  try {
    return decodeURIComponent(new URL(url, "http://x").pathname.split("/").pop() || "image");
  } catch {
    return "image";
  }
}

export function ExamImageField({
  name,
  defaultUrl,
}: {
  name: string;
  defaultUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<Picked | null>(
    defaultUrl ? { url: defaultUrl, name: nameFromUrl(defaultUrl) } : null
  );

  // The saved image was removed and nothing new was picked.
  const removeImage = Boolean(defaultUrl) && !image;

  const pick = (file?: File) => {
    if (!file) return;
    setImage((prev) => {
      if (prev?.url.startsWith("blob:")) URL.revokeObjectURL(prev.url);
      return { url: URL.createObjectURL(file), name: file.name, size: file.size };
    });
  };

  const clear = () => {
    if (image?.url.startsWith("blob:")) URL.revokeObjectURL(image.url);
    if (inputRef.current) inputRef.current.value = "";
    setImage(null);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && inputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(file);
          inputRef.current.files = dt.files;
          pick(file);
        }
      }}
      className="flex h-24.5 items-center border bg-gray-50"
    >
      {image ? (
        <div className="flex w-full items-center gap-4 p-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt="" className="size-21.5 shrink-0 object-cover" />
          <p className="min-w-0 flex-1 truncate text-sm">{image.name}</p>
          {image.size !== undefined && (
            <span className="shrink-0 text-xs text-gray-400">{formatSize(image.size)}</span>
          )}
          <div className="flex shrink-0 items-center gap-3 pr-2">
            <a
              href={image.url}
              download={image.name}
              target="_blank"
              rel="noreferrer"
              aria-label="Download image"
              className="text-blue-600"
            >
              <Download className="size-4" />
            </a>
            <button
              type="button"
              onClick={clear}
              aria-label="Remove image"
              className="text-red-500"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <p className="flex w-full items-center justify-center gap-2 text-xs text-gray-600">
          <UploadCloud className="size-5" /> Drop an image here or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-blue-600"
          >
            select from your computer
          </button>
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />
      <input type="hidden" name="removeImage" value={removeImage ? "1" : "0"} />
    </div>
  );
}
