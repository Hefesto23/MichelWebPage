// src/components/shared/media/ImageUploader.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';

interface UploadedImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  dimensions: { width: number; height: number };
}

interface ImageUploaderProps {
  onUploadSuccess?: (images: UploadedImage[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  maxFiles: _maxFiles = 10,
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [cloudinaryFolder, setCloudinaryFolder] = useState<string | null>(null);
  const [isLoadingFolder, setIsLoadingFolder] = useState(true);

  // Buscar folder correto do ambiente ao montar o componente
  useEffect(() => {
    const fetchCloudinaryConfig = async () => {
      try {
        const response = await fetch('/api/config/cloudinary');
        const data = await response.json();
        const folder = data.folder || 'michel-psi/dev';

        setCloudinaryFolder(folder);
        setIsLoadingFolder(false);
      } catch {
        // Fallback para dev se falhar
        setCloudinaryFolder('michel-psi/dev');
        setIsLoadingFolder(false);
      }
    };

    fetchCloudinaryConfig();
  }, []);
  
  // Função para salvar dados no banco após upload do Cloudinary
  const saveUploadToDatabase = async (cloudinaryResult: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/media/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          public_id: cloudinaryResult.public_id,
          secure_url: cloudinaryResult.secure_url,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          format: cloudinaryResult.format,
          bytes: cloudinaryResult.bytes,
          original_filename: cloudinaryResult.original_filename,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar no banco de dados');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
      throw error;
    }
  };

  // Callback para quando o upload do Cloudinary for bem-sucedido
  const handleUploadSuccess = useCallback(async (result: any) => {
    setIsUploading(true);
    setErrors([]);

    try {
      // Salvar no banco de dados
      const savedUpload = await saveUploadToDatabase(result.info);

      const uploadedImage: UploadedImage = {
        id: savedUpload.id,
        filename: result.info.public_id.split('/').pop() + '.' + result.info.format,
        originalName: result.info.original_filename || 'image',
        url: result.info.secure_url,
        thumbnailUrl: result.info.secure_url.replace('/upload/', '/upload/w_300,h_300,c_fill,q_auto,f_auto/'),
        size: result.info.bytes,
        dimensions: {
          width: result.info.width,
          height: result.info.height
        }
      };

      setUploadResults([uploadedImage]);

      if (onUploadSuccess) {
        onUploadSuccess([uploadedImage]);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar upload';
      setErrors([errorMessage]);

      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess, onUploadError]);

  // Callback para erros no upload
  const handleUploadError = useCallback((error: any) => {
    const errorMessage = error?.message || 'Erro no upload';
    setErrors([errorMessage]);

    if (onUploadError) {
      onUploadError(errorMessage);
    }

    setIsUploading(false);
  }, [onUploadError]);
  
  // Não renderizar o uploader até que o folder seja carregado
  if (isLoadingFolder || !cloudinaryFolder) {
    return (
      <div className={`w-full space-y-4 ${className}`}>
        <div className="relative border-2 border-dashed rounded-lg p-8 text-center border-gray-300 dark:border-gray-600">
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-10 h-10 text-gray-400 animate-pulse" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Carregando configuração...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Detectando ambiente de upload
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Upload Button usando next-cloudinary */}
      <div className="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 dark:border-gray-600">
        <div className="flex flex-col items-center space-y-4">
          <Upload className="w-10 h-10 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Upload de Imagens
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG, WebP até 5MB • Ambiente: {cloudinaryFolder.split('/')[1]}
          </p>

          <CldUploadButton
            uploadPreset="michel-psi-uploads"
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            onClose={() => {
              // Limpar estados ao fechar o widget
              setUploadResults([]);
              setErrors([]);
            }}
            options={{
              multiple: false,
              maxFiles: 1,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
              maxFileSize: 5000000, // 5MB
              folder: cloudinaryFolder, // ✅ Usa folder do ambiente (staging/prod/dev)
              showCompletedButton: true, // Mostrar botão Done
              showUploadMoreButton: false, // Não mostrar "Upload More"
              singleUploadAutoClose: false // NÃO fechar automaticamente após único upload
            }}
            className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
          </CldUploadButton>
        </div>
      </div>
      
      {/* Loading */}
      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" />
          </div>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Processando upload...
          </p>
        </div>
      )}
      
      {/* Resultados do Upload */}
      {uploadResults.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {uploadResults.length} imagem(ns) enviada(s) com sucesso!
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {uploadResults.map((result, index) => (
              <div key={index} className="relative">
                <Image
                  src={result.thumbnailUrl}
                  alt={result.originalName}
                  width={100}
                  height={100}
                  className="w-full h-24 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Erros */}
      {errors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Erros encontrados:</span>
          </div>
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};