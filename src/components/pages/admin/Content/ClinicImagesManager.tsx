// src/components/pages/admin/Content/ClinicImagesManager.tsx
"use client";

import { ImageSelector } from "@/components/shared/media";
import { useState } from "react";
import { AdminCard } from "@/components/shared/cards/BaseCard";
import { DEFAULT_CLINIC_CONTENT } from "@/utils/default-content";
import { Plus, X, Image as ImageIcon, GripVertical } from "lucide-react";
import Image from "next/image";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";

export interface ClinicImage {
  id: number;
  original: string;
  thumbnail: string;
  originalAlt: string;
  originalTitle: string;
  description: string;
  order: number;
  active: boolean;
}

interface ClinicImagesFormData {
  title: string;
  description: string;
  images: ClinicImage[];
}

interface ClinicImagesManagerProps {
  initialData?: ClinicImagesFormData;
  onSave: (data: ClinicImagesFormData) => Promise<void>;
  saving?: boolean;
}

export const ClinicImagesManager: React.FC<ClinicImagesManagerProps> = ({
  initialData,
  onSave,
  saving = false,
}) => {
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClinicImagesFormData>({
    defaultValues: initialData && initialData.images.length > 0 
      ? initialData 
      : {
          title: initialData?.title || DEFAULT_CLINIC_CONTENT.title,
          description: initialData?.description || DEFAULT_CLINIC_CONTENT.description,
          images: [{
            id: 1,
            original: "",
            thumbnail: "",
            originalAlt: "",
            originalTitle: "",
            description: "",
            order: 1,
            active: true,
          }], // Começar com apenas 1 imagem vazia
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const watchedImages = watch("images");

  // Auto-generate thumbnails from original images
  useEffect(() => {
    watchedImages.forEach((image, index) => {
      if (image.original && image.thumbnail !== image.original) {
        setValue(`images.${index}.thumbnail`, image.original, { shouldDirty: true });
      }
    });
  }, [watchedImages, setValue]);

  const addImageSlot = () => {
    if (fields.length >= 10) return;
    
    const newId = Math.max(...fields.map(f => f.id), 0) + 1;
    const newOrder = Math.max(...fields.map(f => f.order), 0) + 1;
    
    append({
      id: newId,
      original: "",
      thumbnail: "",
      originalAlt: "",
      originalTitle: "",
      description: "",
      order: newOrder,
      active: true,
    });
  };

  const removeImageSlot = (index: number) => {
    if (fields.length <= 1) return; // Mínimo 1 imagem
    remove(index);
  };

  const openImageSelector = (index: number) => {
    setCurrentImageIndex(index);
    setImageSelectorOpen(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (currentImageIndex !== null) {
      setValue(`images.${currentImageIndex}.original`, imageUrl, { shouldDirty: true });
      setValue(`images.${currentImageIndex}.thumbnail`, imageUrl, { shouldDirty: true }); // Auto-sync
    }
    setImageSelectorOpen(false);
    setCurrentImageIndex(null);
  };

  const onSubmit = (data: ClinicImagesFormData) => {
    // Ensure thumbnails match originals
    const processedData = {
      ...data,
      images: data.images.map((image, index) => ({
        ...image,
        thumbnail: image.original, // Force thumbnail = original
        order: index + 1, // Reorder based on current position
      })),
    };
    
    onSave(processedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AdminCard title="Configurações da Seção">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Título da Seção
            </label>
            <input
              {...register("title", { required: "Título é obrigatório" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              placeholder="Ex: Nosso Espaço"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Descrição da Seção
            </label>
            <textarea
              {...register("description", { required: "Descrição é obrigatória" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              placeholder="Descreva brevemente a seção..."
              rows={2}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>
      </AdminCard>

      <AdminCard title={`Galeria de Imagens (${fields.length}/10)`}>
        <div className="space-y-4">
          {/* Add Image Button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mínimo 1 imagem, máximo 10 imagens. Thumbnails são gerados automaticamente.
            </p>
            <button
              type="button"
              onClick={addImageSlot}
              disabled={fields.length >= 10}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Imagem</span>
            </button>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 relative group"
              >
                {/* Header with drag handle and remove button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="font-medium">Imagem {index + 1}</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeImageSlot(index)}
                    disabled={fields.length <= 1}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    title={fields.length <= 1 ? "Mínimo 1 imagem necessária" : "Remover imagem"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Image Preview and Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Imagem (Thumbnail gerado automaticamente)
                  </label>
                  
                  <div className="flex flex-col space-y-3">
                    {watchedImages[index]?.original && (
                      <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                        <Image
                          src={watchedImages[index].original}
                          alt={watchedImages[index].originalTitle || `Imagem ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => openImageSelector(index)}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {watchedImages[index]?.original ? "Alterar imagem" : "Selecionar imagem..."}
                    </button>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Título da Imagem
                    </label>
                    <input
                      {...register(`images.${index}.originalTitle`, { 
                        required: "Título é obrigatório" 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 text-sm"
                      placeholder="Ex: Sala de Terapia"
                    />
                    {errors.images?.[index]?.originalTitle && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.images[index]?.originalTitle?.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Descrição
                    </label>
                    <textarea
                      {...register(`images.${index}.description`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 text-sm"
                      placeholder="Descreva esta área do consultório..."
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Alt Text (Acessibilidade)
                    </label>
                    <input
                      {...register(`images.${index}.originalAlt`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 text-sm"
                      placeholder="Descrição para acessibilidade..."
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`images.${index}.active`)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm">
                    Imagem ativa (visível no site)
                  </label>
                </div>
              </div>
            ))}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma imagem configurada</p>
              <button
                type="button"
                onClick={addImageSlot}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Adicionar primeira imagem
              </button>
            </div>
          )}
        </div>
      </AdminCard>

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>{saving ? "Salvando..." : "Salvar Galeria"}</span>
        </button>
      </div>

      {/* Image Selector Modal */}
      <ImageSelector
        isOpen={imageSelectorOpen}
        onClose={() => {
          setImageSelectorOpen(false);
          setCurrentImageIndex(null);
        }}
        onSelect={handleImageSelect}
        title="Selecionar Imagem da Galeria"
        allowUpload={true}
      />
    </form>
  );
};