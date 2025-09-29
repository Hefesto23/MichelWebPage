'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2, GripVertical, Eye, EyeOff, ImageIcon } from 'lucide-react';
import { CloudinaryImage } from '@/components/shared/CloudinaryImage';
import { ImageSelector } from '@/components/shared/media/ImageSelector';

export interface CardData {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  order: number;
  active: boolean;
}

export interface CardsManagerProps {
  cards: CardData[];
  onSave: (cards: CardData[]) => Promise<void>;
  title?: string;
  description?: string;
  minCards?: number;
  maxCards?: number;
}

interface FormData {
  cards: CardData[];
}

export const CardsManager: React.FC<CardsManagerProps> = ({
  cards: initialCards,
  onSave,
  title = "Gerenciar Cards",
  description = "Configure os cards que serão exibidos na página.",
  minCards = 1,
  maxCards = 18,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<number | null>(null);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      cards: initialCards.length > 0 ? initialCards : [createDefaultCard(1)]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cards'
  });

  const watchedCards = watch('cards');

  function createDefaultCard(order: number): CardData {
    return {
      id: Date.now() + Math.random(),
      title: '',
      description: '',
      imageUrl: '',
      href: '#',
      order,
      active: true,
    };
  }

  const addCard = () => {
    if (fields.length < maxCards) {
      const newOrder = Math.max(...watchedCards.map(c => c.order), 0) + 1;
      append(createDefaultCard(newOrder));
      setIsDirty(true);
    }
  };

  const removeCard = (index: number) => {
    if (fields.length > minCards) {
      remove(index);
      setIsDirty(true);
    }
  };

  const toggleCardActive = (index: number) => {
    const currentValue = watchedCards[index].active;
    setValue(`cards.${index}.active`, !currentValue);
    setIsDirty(true);
  };

  const openImageSelector = (index: number) => {
    setCurrentImageField(index);
    setImageSelectorOpen(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (currentImageField !== null) {
      setValue(`cards.${currentImageField}.imageUrl`, imageUrl);
      setIsDirty(true);
    }
    setImageSelectorOpen(false);
    setCurrentImageField(null);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Reordenar cards baseado na posição no array
      const reorderedCards = data.cards.map((card, index) => ({
        ...card,
        order: index + 1
      }));

      await onSave(reorderedCards);
      setIsDirty(false);
    } catch (error) {
      console.error('Erro ao salvar cards:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Mínimo: {minCards} cards | Máximo: {maxCards} cards | Atual: {fields.length} cards
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4 relative">
              {/* Header do Card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-muted-foreground cursor-grab" />
                  <span className="font-medium">Card {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => toggleCardActive(index)}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded
                               ${watchedCards[index]?.active
                                 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                 : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                               }`}
                  >
                    {watchedCards[index]?.active ? <Eye size={12} /> : <EyeOff size={12} />}
                    {watchedCards[index]?.active ? 'Ativo' : 'Inativo'}
                  </button>
                </div>

                {fields.length > minCards && (
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Campos do Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Título *</label>
                    <input
                      {...control.register(`cards.${index}.title`, {
                        required: 'Título é obrigatório',
                        onChange: () => setIsDirty(true)
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Digite o título do card"
                    />
                    {errors.cards?.[index]?.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.cards[index].title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Link (href)</label>
                    <input
                      {...control.register(`cards.${index}.href`, {
                        onChange: () => setIsDirty(true)
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="https://... ou /pagina"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                    <div className="flex gap-2">
                      <input
                        {...control.register(`cards.${index}.imageUrl`, {
                          onChange: () => setIsDirty(true)
                        })}
                        className="flex-1 px-3 py-2 border rounded-md"
                        placeholder="URL da imagem"
                      />
                      <button
                        type="button"
                        onClick={() => openImageSelector(index)}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2"
                      >
                        <ImageIcon size={16} />
                        Galeria
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <textarea
                      {...control.register(`cards.${index}.description`, {
                        onChange: () => setIsDirty(true)
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md resize-none"
                      placeholder="Descrição do card"
                    />
                  </div>

                  {/* Preview da Imagem */}
                  {watchedCards[index]?.imageUrl && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Preview</label>
                      <div className="relative w-full h-32 border rounded-md overflow-hidden bg-gray-50">
                        <CloudinaryImage
                          src={watchedCards[index].imageUrl}
                          alt={watchedCards[index].title || 'Preview'}
                          fill
                          className="object-cover"
                          width={300}
                          height={200}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão para Adicionar Card */}
        {fields.length < maxCards && (
          <button
            type="button"
            onClick={addCard}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300
                       rounded-lg hover:border-gray-400 transition-colors w-full justify-center
                       text-muted-foreground hover:text-foreground"
          >
            <Plus size={16} />
            Adicionar Card ({fields.length}/{maxCards})
          </button>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </button>

          <div className="text-xs text-muted-foreground flex items-center">
            {isDirty ? 'Há alterações não salvas' : 'Todas as alterações foram salvas'}
          </div>
        </div>
      </form>

      {/* Image Selector Modal */}
      <ImageSelector
        isOpen={imageSelectorOpen}
        onClose={() => {
          setImageSelectorOpen(false);
          setCurrentImageField(null);
        }}
        onSelect={handleImageSelect}
        title="Selecionar Imagem da Galeria"
      />
    </div>
  );
};