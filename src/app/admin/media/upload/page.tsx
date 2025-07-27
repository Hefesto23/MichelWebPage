// ============================================
// 9. src/app/admin/media/upload/page.tsx
// ============================================

import { MediaUpload } from "@/components/pages/admin/Media";
import { AdminCard } from "@/components/shared/cards/BaseCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MediaUploadPage() {
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

      {/* Upload Component */}
      <MediaUpload
        onUploadSuccess={(newFile) => {
          console.log("Upload realizado:", newFile);
        }}
      />

      {/* Tips Card - Mantendo exatamente igual ao original */}
      <div className="mt-8">
        <AdminCard title="Dicas para Otimização de Imagens">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
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
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
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
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
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
