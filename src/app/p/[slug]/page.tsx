// src/app/p/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";

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

async function getPage(slug: string): Promise<DynamicPage | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/pages/${slug}`, {
      next: { revalidate: 300, tags: ["dynamic-pages", `page-${slug}`] },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao buscar página:", error);
    return null;
  }
}

export default async function DynamicPageView({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getPage(params.slug);

  if (!page || !page.isActive) {
    notFound();
  }

  return (
    <div>
      {/* Banner (se existir) */}
      {page.bannerImage && (
        <div className="relative w-full h-64 md:h-72 overflow-hidden">
          <Image
            src={page.bannerImage}
            alt={page.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        </div>
      )}

      {/* Conteúdo */}
      <section className="py-16 relative z-0 overflow-hidden">
        <div className="content-container">
          <div className="relative z-10">
            <article className="w-full">
              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 md:mb-12">
                {page.title}
              </h1>

              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-primary-foreground dark:prose-a:text-btn prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-a:transition-all
                  prose-strong:text-foreground prose-strong:font-bold
                  prose-ul:my-6 prose-ul:space-y-2
                  prose-ol:my-6 prose-ol:space-y-2
                  prose-li:text-muted-foreground
                  prose-li:marker:text-primary-foreground dark:prose-li:marker:text-btn
                  prose-blockquote:border-l-4 prose-blockquote:border-primary-foreground dark:prose-blockquote:border-btn prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
                  prose-code:text-foreground prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                  prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

// Metadados dinâmicos
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getPage(params.slug);

  if (!page) {
    return {
      title: "Página não encontrada",
    };
  }

  return {
    title: page.title,
    description: page.content.substring(0, 160).replace(/<[^>]*>/g, ""),
  };
}
