"use client";

import { useRef, useState } from "react";
import { ImageIcon, UploadCloud } from "lucide-react";

export function ImageDropzone({ name, defaultUrl }: { name: string; defaultUrl?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultUrl);

  const setFile = (file?: File) => file && setPreview(URL.createObjectURL(file));

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
          setFile(file);
        }
      }}
      className="relative flex h-[88px] items-center border px-6"
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="size-14 object-cover" />
      ) : (
        <ImageIcon className="size-10 text-gray-200" />
      )}

      <p className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-gray-600">
        <UploadCloud className="size-5" /> Drop an image here or{" "}
        <button type="button" onClick={() => inputRef.current?.click()} className="text-blue-600">
          select from your computer
        </button>
      </p>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        hidden
        onChange={(e) => setFile(e.target.files?.[0])}
      />
    </div>
  );
}