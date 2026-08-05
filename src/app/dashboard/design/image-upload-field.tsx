"use client";

import { useRef, useState } from "react";

export function ImageUploadField({
  label,
  shape,
  previewClassName,
  currentUrl,
  onChange,
  uploadAction,
  removeAction,
}: {
  label: string;
  shape: "circle" | "banner";
  previewClassName?: string;
  currentUrl: string;
  onChange: (url: string) => void;
  uploadAction: (formData: FormData) => Promise<string>;
  removeAction: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shapeClass = shape === "circle" ? (previewClassName ?? "rounded-full") : "rounded-lg";
  const previewClass = shape === "circle" ? `h-14 w-14 object-cover ${shapeClass}` : `h-12 w-24 object-cover ${shapeClass}`;
  const placeholderClass = shape === "circle" ? `h-14 w-14 bg-neutral-100 ${shapeClass}` : `h-12 w-24 bg-neutral-100 ${shapeClass}`;

  async function handleFile(file: File) {
    setError(null);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    onChange(localUrl);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadedUrl = await uploadAction(formData);
      setPreview(uploadedUrl);
      onChange(uploadedUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message && !message.includes("unexpected response")
          ? message
          : "Falha na conexão — atualize a página (Ctrl+Shift+R) e tente de novo.",
      );
      setPreview(currentUrl);
      onChange(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className={previewClass} />
        ) : (
          <div className={placeholderClass} />
        )}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/5 disabled:opacity-50"
          >
            {uploading ? "Enviando…" : preview ? "Trocar imagem" : "Enviar imagem"}
          </button>
          {preview && !uploading && (
            <button
              type="button"
              onClick={async () => {
                setPreview("");
                onChange("");
                await removeAction();
              }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              remover
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-[11px] text-black/40">PNG, JPG, WEBP ou GIF — até 4MB.</p>
    </div>
  );
}
