// src/components/shared/media/ImageSelector.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, Upload, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ImageUploader } from './ImageUploader';

interface ImageInfo {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  uploadedAt: string;
}

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  title?: string;
  allowUpload?: boolean;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = "Selecionar Imagem",
  allowUpload = true
}) => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/media/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar imagens');
      }
      
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, loadImages]);
  
  const handleDeleteImage = async (filename: string) => {
    if (!confirm('Tem certeza que deseja deletar esta imagem?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/media/delete?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao deletar imagem');
      }
      
      // Recarregar lista
      loadImages();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar imagem. Tente novamente.');
    }
  };
  
  const handleUploadSuccess = () => {
    setShowUploader(false);
    loadImages();
  };
  
  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };
  
  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 flex flex-col min-h-0">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setShowUploader(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !showUploader
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Galeria ({images.length})
            </button>
            {allowUpload && (
              <button
                onClick={() => setShowUploader(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  showUploader
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload
              </button>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {showUploader ? (
              <ImageUploader
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) => setError(error)}
                maxFiles={10}
              />
            ) : (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar imagens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Loading */}
                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
                
                {/* Error */}
                {error && (
                  <div className="text-red-600 dark:text-red-400 text-center py-4">
                    {error}
                  </div>
                )}
                
                {/* Empty State */}
                {!loading && !error && filteredImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Nenhuma imagem encontrada</p>
                    <p className="text-sm">
                      {images.length === 0 
                        ? 'Faça upload de algumas imagens para começar' 
                        : 'Tente uma pesquisa diferente'
                      }
                    </p>
                  </div>
                )}
                
                {/* Image Grid */}
                {!loading && filteredImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {filteredImages.map((image) => (
                      <div 
                        key={image.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === image.url
                            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleSelectImage(image.url)}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={image.thumbnailUrl}
                            alt={image.filename}
                            fill
                            className="object-cover"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
                          
                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(image.filename);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          
                          {/* Selected indicator */}
                          {selectedImage === image.url && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                ✓
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="p-2 bg-white dark:bg-gray-700">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                            {image.filename}
                          </p>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{formatFileSize(image.size)}</span>
                            <span>{formatDate(image.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        {!showUploader && (
          <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedImage ? 'Imagem selecionada' : 'Selecione uma imagem'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!selectedImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selecionar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};