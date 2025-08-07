// src/components/shared/media/ImageUploader.tsx
"use client";

import { useState, useCallback, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

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
  maxFiles = 10,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadResults, setUploadResults] = useState<UploadedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return `${file.name}: Tipo não suportado (apenas JPG, PNG, WebP)`;
    }
    
    if (file.size > maxSize) {
      return `${file.name}: Arquivo muito grande (máximo 5MB)`;
    }
    
    return null;
  };
  
  const handleFileSelect = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const fileErrors: string[] = [];
    
    // Validar arquivos
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        fileErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });
    
    // Limitar número de arquivos
    if (selectedFiles.length + validFiles.length > maxFiles) {
      fileErrors.push(`Máximo de ${maxFiles} arquivos permitido`);
      return;
    }
    
    setErrors(fileErrors);
    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, [selectedFiles, maxFiles]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);
  
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);
  
  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setErrors([]);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro no upload');
      }
      
      setUploadResults(result.uploaded);
      setSelectedFiles([]);
      setUploadProgress(100);
      
      if (result.errors) {
        setErrors(result.errors);
      }
      
      if (onUploadSuccess) {
        onUploadSuccess(result.uploaded);
      }
      
    } catch (error) {
      console.error('Erro no upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no upload';
      setErrors([errorMessage]);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadResults([]);
      }, 3000);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Área de Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-10 h-10 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isDragging ? 'Solte as imagens aqui' : 'Arraste imagens ou clique para selecionar'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG, WebP até 5MB • Máximo {maxFiles} arquivos
          </p>
        </div>
      </div>
      
      {/* Arquivos Selecionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            Arquivos Selecionados ({selectedFiles.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Botão de Upload */}
          <button
            onClick={uploadFiles}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isUploading ? 'Enviando...' : `Enviar ${selectedFiles.length} arquivo(s)`}
          </button>
        </div>
      )}
      
      {/* Progresso */}
      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Processando imagens...
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