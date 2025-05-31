// src/app/admin/media/upload/page.tsx

"use client";

import { AdminCard } from "@/components/admin/AdminCard";
import { ArrowLeft, Check, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

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
  status: "uploading" | "success" | "error";
  error?: string;
}

interface UploadProgress {
  [key: string]: number;
}

export default function MediaUpload() {
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: "", label: "Selecione uma categoria" },
    { value: "profile", label: "Fotos de Perfil" },
    { value: "services", label: "Serviços e Terapias" },
    { value: "gallery", label: "Galeria Geral" },
    { value: "hero", label: "Banners e Heroes" },
    { value: "testimonials", label: "Depoimentos" },
  ];

  const handleUpload = async (files: FileList) => {
    setError(null);
    const newUploads: UploadedImage[] = [];

    // Adicionar files na lista com status inicial
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = Date.now() + i;

      newUploads.push({
        id: tempId,
        url: URL.createObjectURL(file),
        filename: file.name,
        originalName: file.name,
        size: file.size,
        category: selectedCategory,
        status: "uploading",
      });
    }

    setUploads((prev) => [...prev, ...newUploads]);

    // Upload cada arquivo individualmente
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadId = newUploads[i].id;

      try {
        await uploadFile(file, uploadId);
      } catch (error) {
        console.error("Erro no upload:", error);
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadId
              ? { ...upload, status: "error", error: "Erro no upload" }
              : upload
          )
        );
      }
    }
  };

  const uploadFile = async (file: File, uploadId: number) => {
    // const token = localStorage.getItem('token');

    // Validações
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === uploadId
            ? {
                ...upload,
                status: "error",
                error: "Arquivo muito grande (máximo 5MB)",
              }
            : upload
        )
      );
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === uploadId
            ? {
                ...upload,
                status: "error",
                error: "Tipo de arquivo não permitido",
              }
            : upload
        )
      );
      return;
    }

    try {
      // Em um ambiente real, você faria uma chamada à API para fazer o upload
      // Exemplo:
      // const formData = new FormData();
      // formData.append('file', file);
      // if (selectedCategory) formData.append('category', selectedCategory);
      //
      // const response = await fetch('/api/admin/upload', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` },
      //   body: formData,
      // });

      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[uploadId] || 0;
          const next = Math.min(current + Math.random() * 30, 90);
          return { ...prev, [uploadId]: next };
        });
      }, 500);

      // Simular upload
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 3000)
      );

      clearInterval(progressInterval);
      setUploadProgress((prev) => ({ ...prev, [uploadId]: 100 }));

      // Simular resposta do servidor
      const result = {
        success: true,
        upload: {
          id: Math.floor(Math.random() * 10000),
          url: `/uploads/2024/05/${file.name}`,
          filename: file.name,
          originalName: file.name,
          size: file.size,
          width: 1920,
          height: 1080,
        },
      };

      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === uploadId
            ? {
                ...upload,
                ...result.upload,
                status: "success",
              }
            : upload
        )
      );
    } catch (error) {
      console.error("Erro no upload:", error);
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === uploadId
            ? {
                ...upload,
                status: "error",
                error:
                  error instanceof Error ? error.message : "Erro desconhecido",
              }
            : upload
        )
      );
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const removeUpload = (uploadId: number) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== uploadId));
    setUploadProgress((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [uploadId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href="/admin/media"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Upload de Imagens
          </h1>
          <p className="text-muted-foreground mt-1">
            Adicione novas imagens ao seu site
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <AdminCard title="Enviar Imagens">
        <div className="space-y-6">
          {/* Category Selector */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Categoria das Imagens
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Selecione uma categoria para organizar suas imagens.
            </p>
          </div>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
              accept="image/*"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              className="hidden"
            />

            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-16 h-16 text-gray-400" />
              <div>
                <p className="text-lg font-medium">
                  Arraste e solte imagens aqui ou{" "}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary-foreground hover:underline"
                  >
                    clique para selecionar
                  </button>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Aceita: JPG, PNG, WebP (até 5MB cada)
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploads.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Uploads ({uploads.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative"
                  >
                    <button
                      onClick={() => removeUpload(upload.id)}
                      className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex space-x-3">
                      <div className="w-20 h-20 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        {upload.url && (
                          <Image
                            src={upload.url}
                            alt={upload.originalName}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">
                          {upload.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(upload.size)}
                          {upload.width && upload.height && (
                            <span>
                              {" "}
                              • {upload.width}×{upload.height}
                            </span>
                          )}
                        </p>

                        {/* Status indicator */}
                        {upload.status === "uploading" && (
                          <div className="mt-2">
                            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-foreground"
                                style={{
                                  width: `${uploadProgress[upload.id] || 0}%`,
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Enviando...{" "}
                              {Math.round(uploadProgress[upload.id] || 0)}%
                            </p>
                          </div>
                        )}

                        {upload.status === "success" && (
                          <div className="text-green-600 dark:text-green-400 mt-2 flex items-center">
                            <Check className="w-4 h-4 mr-1" />
                            <span className="text-xs">Upload concluído</span>
                          </div>
                        )}

                        {upload.status === "error" && (
                          <div className="text-red-600 dark:text-red-400 mt-2 text-xs">
                            Erro: {upload.error || "Falha no upload"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminCard>

      {/* Tips Card */}
      <div className="mt-8">
        <AdminCard title="Dicas para Otimização de Imagens">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium">Tamanho recomendado</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Fotos de perfil: 800×800 pixels
                <br />
                Banners: 1920×1080 pixels
                <br />
                Galeria: 1200×800 pixels
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium">Formatos otimizados</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Use JPEG para fotos
                <br />
                Use PNG para gráficos com transparência
                <br />
                WebP oferece melhor compressão
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium">Para melhor desempenho</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Mantenha o tamanho dos arquivos abaixo de 500KB
                <br />
                Adicione textos alternativos descritivos
                <br />
                Use nomes de arquivos significativos
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
