// ============================================
// src/components/pages/home/WelcomeSection.tsx
// ============================================

import { getWelcomeContent } from "@/components/pages/home/welcome-content";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { parseMarkdownToJSX } from "./MarkdownParser";

export const WelcomeSection = async () => {
  // Buscar conteúdo no servidor com cache otimizado
  const { title, content, profileImage } = await getWelcomeContent();
  return (
    <section id="saiba-mais" className="welcome-section">
      <div className="content-container">
        <div className="welcome-container">
          <div className="welcome-text">
            <div className="section-header">
              <h1 className="section-title text-lg sm:text-xl md:text-2xl">{title}</h1>
            </div>
            <div className="welcome-content text-xs sm:text-sm md:text-base lg:text-lg">
              <article>{parseMarkdownToJSX(content)}</article>
            </div>
          </div>

          <div className="welcome-image">
            <CloudinaryImage
              src={profileImage}
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
