// src/components/pages/admin/Pages/PagesManager.tsx
"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit, Plus, Eye, ExternalLink, Image as ImageIcon } from "lucide-react";
import { ImageSelector } from "@/components/shared/media/ImageSelector";
import Image from "next/image";

interface DynamicPage {
  id: number;
  slug: string;
  title: string;
  bannerImage: string | null;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function PagesManager() {
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/pages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar páginas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Tem certeza que deseja deletar a página "${title}"?\n\nEsta ação não pode ser desfeita.`)) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/pages?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Página deletada com sucesso!");
        await loadPages();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao deletar página");
      }
    } catch (error) {
      console.error("Erro ao deletar página:", error);
      alert("Erro ao deletar página. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (page: DynamicPage) => {
    setEditingPage(page);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingPage(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPage(null);
    loadPages();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground"></div>
      </div>
    );
  }

  if (showForm) {
    return <PageForm page={editingPage} onClose={handleFormClose} />;
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Páginas Personalizadas</h1>
            <p className="text-muted-foreground mt-2">
              Crie páginas genéricas com banner e conteúdo personalizado
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nova Página
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Eye className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma página criada</h3>
            <p className="text-muted-foreground mb-6">Comece criando sua primeira página personalizada</p>
            <button
              onClick={handleNew}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Criar Primeira Página
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-foreground">
                        {page.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          page.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {page.isActive ? "✓ Ativa" : "○ Inativa"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-muted-foreground">URL:</span>
                      <code className="bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md text-sm font-mono">
                        /p/{page.slug}
                      </code>
                    </div>
                    {page.bannerImage && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        <span>Com imagem de banner</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`/p/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-muted-foreground hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      title="Visualizar página"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleEdit(page)}
                      className="p-3 text-muted-foreground hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      title="Editar página"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
                      disabled={deletingId === page.id}
                      className="p-3 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Deletar página"
                    >
                      {deletingId === page.id ? (
                        <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Formulário de criação/edição
function PageForm({
  page,
  onClose,
}: {
  page: DynamicPage | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    slug: page?.slug || "",
    title: page?.title || "",
    bannerImage: page?.bannerImage || "",
    content: page?.content || "",
    isActive: page?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const url = "/api/admin/pages";
      const method = page ? "PUT" : "POST";
      const body = page ? { id: page.id, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(page ? "Página atualizada!" : "Página criada!");
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao salvar página");
      }
    } catch (error) {
      console.error("Erro ao salvar página:", error);
      alert("Erro ao salvar página");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {page ? "Editar Página" : "Nova Página"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {page ? "Atualize as informações da página" : "Preencha os dados para criar uma nova página"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção: Informações Básicas */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              Informações Básicas
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Endereço da Página (Slug) *
                </label>
                <input
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="politica-de-privacidade"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-foreground transition-colors"
                  disabled={!!page}
                />
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>URL da página:</strong> <code className="bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded">/p/{formData.slug || "seu-slug"}</code>
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    Use apenas letras minúsculas, números e hífens (ex: sobre-nos, politica-privacidade)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Título da Página *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Política de Privacidade"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-foreground transition-colors"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este será o título principal exibido no topo da página
                </p>
              </div>
            </div>
          </div>

          {/* Seção: Banner */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
              </div>
              Imagem de Banner (Opcional)
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Adicione uma imagem de destaque que aparecerá no topo da página
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowImageSelector(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Escolher Imagem
                  </button>

                  {formData.bannerImage && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerImage: "" })}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Remover Banner
                    </button>
                  )}
                </div>
              </div>

              {/* Preview do Banner */}
              {formData.bannerImage && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Preview:</p>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                    <Image
                      src={formData.bannerImage}
                      alt="Preview do banner"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    URL: {formData.bannerImage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Seção: Conteúdo */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
              </div>
              Conteúdo da Página *
            </h2>

            <div className="space-y-3">
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={`<p>Bem-vindo à nossa <strong>página de exemplo</strong>.</p>

<h2>Seção 1</h2>
<p>Texto da primeira seção...</p>

<h3>Subseção com lista:</h3>
<ul>
  <li><strong>Item 1:</strong> Descrição do item</li>
  <li><strong>Item 2:</strong> Descrição do item</li>
</ul>

<p>Veja também: <a href="/contato">Entre em contato</a></p>`}
                rows={18}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-foreground dark:focus:border-btn focus:outline-none bg-white dark:bg-gray-700 text-foreground font-mono text-sm transition-colors"
              />
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">
                  💡 Dica: Tags HTML permitidas
                </p>
                <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  <p><code className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded">&lt;p&gt;</code> Parágrafo</p>
                  <p><code className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded">&lt;h2&gt; &lt;h3&gt;</code> Títulos</p>
                  <p><code className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded">&lt;ul&gt; &lt;li&gt;</code> Lista</p>
                  <p><code className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded">&lt;strong&gt;</code> Negrito</p>
                  <p><code className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded">&lt;a href=&quot;/link&quot;&gt;</code> Link</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Configurações */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">4</span>
              </div>
              Configurações
            </h2>

            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-colors">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">Página Ativa</p>
                <p className="text-xs text-muted-foreground">Marque para tornar a página visível publicamente</p>
              </div>
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
            >
              {saving ? "Salvando..." : page ? "💾 Atualizar Página" : "✨ Criar Página"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-foreground rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Image Selector Modal */}
        <ImageSelector
          isOpen={showImageSelector}
          onClose={() => setShowImageSelector(false)}
          onSelect={(imageUrl) => {
            setFormData({ ...formData, bannerImage: imageUrl });
            setShowImageSelector(false);
          }}
          title="Selecionar Banner"
        />
      </div>
    </div>
  );
}
