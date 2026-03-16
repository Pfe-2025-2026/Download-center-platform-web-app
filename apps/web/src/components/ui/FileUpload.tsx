import React, { useCallback, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  className?: string;
}

export function FileUpload({ accept = ".deb,.pkg.tar.zst", onFileSelect, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (f: File) => {
      setFile(f);
      onFileSelect(f);
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
    },
    [handleFile],
  );

  const clear = () => setFile(null);

  return (
    <div className={cn("w-full", className)}>
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <FileText className="h-8 w-8 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={clear} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            dragOver
              ? "border-primary bg-primary-50"
              : "border-gray-300 bg-white hover:border-primary hover:bg-gray-50",
          )}
        >
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Click to upload or drag & drop
          </p>
          <p className="mt-1 text-xs text-gray-400">Accepted: {accept}</p>
          <input type="file" accept={accept} onChange={handleChange} className="hidden" />
        </label>
      )}
    </div>
  );
}
