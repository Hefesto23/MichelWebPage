// ============================================
// src/components/pages/admin/MediaManager.tsx
// ============================================
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { ImageUploader } from "@/components/shared/media";
import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  uploadedAt: string;
}

export const MediaManager = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [fetchingFiles, setFetchingFiles] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async (skipLoading = false) => {
    if (!skipLoading) {
      setFetchingFiles(true);
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/media/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.images || []);
      }
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
    } finally {
      if (!skipLoading) {
        setFetchingFiles(false);
      }
    }
  };

  const deleteFile = async (fileId: string, filename: string) => {
    if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

    // Remover imediatamente da lista (otimistic update)
    const originalFiles = files;
    setFiles(files.filter((file) => file.id !== fileId));

    try {
      const token = localStorage.getItem("token");
      // O ID do arquivo é o public_id do Cloudinary
      const response = await fetch(`/api/admin/media/delete?publicId=${encodeURIComponent(fileId)}&filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Se falhar, restaurar a lista original
        console.error("Erro ao deletar arquivo - restaurando lista");
        setFiles(originalFiles);
        alert("Erro ao deletar arquivo. Tente novamente.");
      } else {
        console.log("✅ Arquivo deletado com sucesso");
      }
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      // Restaurar lista em caso de erro
      setFiles(originalFiles);
      alert("Erro ao deletar arquivo. Tente novamente.");
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
      <AdminCard title="Upload de Imagens">
        <ImageUploader
          onUploadSuccess={(images) => {
            console.log('🎯 MediaManager: onUploadSuccess chamado com', images);
            
            // Adicionar imediatamente as novas imagens ao estado
            const newFiles: MediaFile[] = images.map(img => ({
              id: img.id,
              filename: img.filename,
              url: img.url,
              thumbnailUrl: img.thumbnailUrl,
              size: img.size,
              uploadedAt: new Date().toISOString()
            }));
            
            console.log('📁 Adicionando arquivos ao estado:', newFiles);
            
            // Adicionar ao início da lista (mais recentes primeiro)
            setFiles(prevFiles => {
              const updatedFiles = [...newFiles, ...prevFiles];
              console.log('📊 Estado atualizado - total de arquivos:', updatedFiles.length);
              return updatedFiles;
            });
            
            // Fazer fetch após 2 segundos para garantir sincronização com Cloudinary
            // skipLoading = true para não mostrar loading, já que a imagem já está visível
            setTimeout(() => {
              console.log('🔄 Fazendo fetch para sincronizar com Cloudinary...');
              fetchFiles(true);
            }, 2000);
          }}
          onUploadError={(error) => alert(`Erro no upload: ${error}`)}
          maxFiles={10}
        />
      </AdminCard>

      {/* Files Grid */}
      <AdminCard title={`Arquivos (${files.length})`}>
        {fetchingFiles ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Carregando arquivos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border group hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded overflow-hidden mb-3">
                  <Image
                    src={file.thumbnailUrl}
                    alt={file.filename}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(file.url, "_blank")}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(file.url);
                        alert('URL copiada para a área de transferência!');
                      }}
                      className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                      title="Copiar URL"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFile(file.id, file.filename)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium truncate mb-1">
                    {file.filename}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!fetchingFiles && files.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum arquivo encontrado</p>
            <p className="text-sm text-gray-500 mt-2">Faça upload de algumas imagens para começar</p>
          </div>
        )}
      </AdminCard>
    </div>
  );
};
