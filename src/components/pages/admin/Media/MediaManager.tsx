// ============================================
// src/components/pages/admin/MediaManager.tsx
// ============================================
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { ImageUpload } from "@/components/shared/media";
import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  category?: string;
  alt?: string;
  createdAt: string;
}

export const MediaManager = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [fetchingFiles, setFetchingFiles] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "Todas" },
    { value: "profile", label: "Perfil" },
    { value: "gallery", label: "Galeria" },
    { value: "services", label: "Serviços" },
    { value: "hero", label: "Hero" },
  ];

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setFetchingFiles(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/media", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
    } finally {
      setFetchingFiles(false);
    }
  };

  const deleteFile = async (fileId: number) => {
    if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFiles(files.filter((file) => file.id !== fileId));
      }
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    }
  };

  const filteredFiles =
    selectedCategory === "all"
      ? files
      : files.filter((file) => file.category === selectedCategory);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Gerenciador de Mídia
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie todas as imagens e arquivos do site
        </p>
      </div>

      {/* Upload Section */}
      <ImageUpload
        onUploadSuccess={(newFile) => {
          setFiles((prev) => [
            ...prev,
            {
              ...newFile,
              createdAt: new Date().toISOString(), // Ensure 'createdAt' is provided
            } as MediaFile,
          ]);
        }}
      />

      {/* Filter Section */}
      <AdminCard title="Filtros">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.value
                  ? "bg-primary-foreground text-white"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </AdminCard>

      {/* Files Grid */}
      <AdminCard title={`Arquivos (${filteredFiles.length})`}>
        {fetchingFiles ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Carregando arquivos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border group hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded overflow-hidden mb-3">
                  <Image
                    src={file.url}
                    alt={file.alt || file.originalName}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(file.url, "_blank")}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium truncate mb-1">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  {file.category && (
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {file.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!fetchingFiles && filteredFiles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum arquivo encontrado</p>
          </div>
        )}
      </AdminCard>
    </div>
  );
};
