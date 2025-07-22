// ============================================
// src/components/shared/media/ImageUpload.tsx
// ============================================
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { AdminCard } from "../cards/BaseCard";

interface UploadedImage {
  id: number;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  category?: string;
}

interface ImageUploadProps {
  category?: string;
  onUploadSuccess?: (image: UploadedImage) => void;
  maxFiles?: number;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  category,
  onUploadSuccess,
  maxFiles = 5,
  accept = "image/*",
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    const token = localStorage.getItem("token");

    try {
      for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        if (category) formData.append("category", category);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          const newUpload: UploadedImage = result.upload;
          setUploads((prev) => [...prev, newUpload]);
          onUploadSuccess?.(newUpload);
        } else {
          throw new Error("Erro no upload");
        }
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload das imagens");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const removeUpload = async (uploadId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/admin/upload?id=${uploadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUploads((prev) => prev.filter((upload) => upload.id !== uploadId));
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <AdminCard title="Upload de Imagens">
      <div className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-primary-foreground bg-primary/5"
              : "border-gray-300 dark:border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">
                Arraste imagens aqui ou{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary-foreground hover:underline"
                  disabled={uploading}
                >
                  clique para selecionar
                </button>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Máximo {maxFiles} arquivos, até 5MB cada
              </p>
            </div>
          </div>
        </div>

        {uploading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-foreground"></div>
            <span className="ml-2">Fazendo upload...</span>
          </div>
        )}

        {uploads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border"
              >
                <button
                  onClick={() => removeUpload(upload.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-3">
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                    <Image
                      src={upload.url}
                      alt={upload.alt || upload.originalName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate">
                      {upload.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(upload.size)}
                      {upload.width && upload.height && (
                        <span>
                          {" "}
                          • {upload.width}×{upload.height}
                        </span>
                      )}
                    </p>
                    <input
                      type="text"
                      placeholder="Texto alternativo..."
                      defaultValue={upload.alt || ""}
                      className="w-full text-xs p-2 border rounded"
                      onBlur={(e) => {
                        console.log("Update alt text:", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminCard>
  );
};
