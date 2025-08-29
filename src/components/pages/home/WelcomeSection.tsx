// ============================================
// src/components/pages/home/WelcomeSection.tsx
// ============================================

import { getWelcomeContent } from "@/components/pages/home/welcome-content";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { parseMarkdownToJSX } from "./MarkdownParser";

export const WelcomeSection = async () => {
  // Buscar conteúdo no servidor com cache otimizado
  const { title, content } = await getWelcomeContent();
  return (
    <section id="saiba-mais" className="welcome-section">
      <div className="content-container">
        <div className="welcome-container">
          <div className="welcome-text">
            <div className="section-header">
              <h1 className="section-title">{title}</h1>
            </div>
            <div className="welcome-content">
              <article>{parseMarkdownToJSX(content)}</article>
            </div>
          </div>

          <div className="welcome-image">
            <CloudinaryImage
              src="/assets/michel1.svg"
              alt="Foto de Michel Psicologo Clinico"
              fill
              className="object-contain"
              width={500}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
