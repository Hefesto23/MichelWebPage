'use client';

import { useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardPaginationProps<T> {
  items: T[];
  pageSize?: number;
  renderItem: (item: T, index: number) => ReactNode;
  gridClassName?: string;
  paginationClassName?: string;
  showItemCount?: boolean;
}

export function CardPagination<T>({
  items,
  pageSize = 6,
  renderItem,
  gridClassName = "grid-services",
  paginationClassName = "",
  showItemCount = true
}: CardPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum item encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de Cards */}
      <div className={gridClassName}>
        {currentItems.map((item, index) => renderItem(item, startIndex + index))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className={`flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4 ${paginationClassName}`}>
          {/* Contador de itens */}
          {showItemCount && (
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Mostrando {startIndex + 1}-{Math.min(endIndex, items.length)} de {items.length} itens
            </div>
          )}

          {/* Controles de paginação */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md border transition-colors
                         hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-transparent"
            >
              <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Anterior</span>
              <span className="sm:hidden">Ant</span>
            </button>

            {/* Numeração das páginas */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-md border transition-colors
                             ${currentPage === page
                               ? 'bg-primary text-primary-foreground border-primary'
                               : 'hover:bg-muted'
                             }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md border transition-colors
                         hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-transparent"
            >
              <span className="hidden sm:inline">Próximo</span>
              <span className="sm:hidden">Próx</span>
              <ChevronRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {!showItemCount && (
            <div></div> // Espaço vazio para manter o layout centrado
          )}
        </div>
      )}
    </div>
  );
}