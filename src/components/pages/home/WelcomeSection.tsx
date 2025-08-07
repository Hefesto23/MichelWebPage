// ============================================
// src/components/pages/home/WelcomeSection.tsx
// ============================================
"use client";

import { DEFAULT_WELCOME_CONTENT } from "@/utils/default-content";
import Image from "next/image";
import { useEffect, useState } from "react";

const parseMarkdownToJSX = (content: string) => {
  // Converter markdown básico para JSX
  return content
    .split('\n\n')
    .map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      if (!trimmedParagraph) return null;
      
      // Lista numerada
      if (trimmedParagraph.match(/^\d\./)) {
        const listItems = trimmedParagraph
          .split('\n')
          .filter(item => item.match(/^\d\./))
          .map((item, i) => {
            const text = item.replace(/^\d\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
            return `<li>${text}</li>`;
          });
        
        return (
          <ol key={index} className="list-decimal" dangerouslySetInnerHTML={{
            __html: listItems.join('')
          }} />
        );
      }
      
      // Lista com bullets
      if (trimmedParagraph.match(/^•/)) {
        const listItems = trimmedParagraph
          .split('\n')
          .filter(item => item.match(/^•/))
          .map((item, i) => {
            const text = item.replace(/^•\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
            return `<li>${text}</li>`;
          });
        
        return (
          <ul key={index} className="list-disc" dangerouslySetInnerHTML={{
            __html: listItems.join('')
          }} />
        );
      }
      
      // Parágrafo normal
      const formattedText = trimmedParagraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />
      );
    })
    .filter(Boolean);
};

export const WelcomeSection = () => {
  const [title, setTitle] = useState(DEFAULT_WELCOME_CONTENT.title);
  const [content, setContent] = useState(DEFAULT_WELCOME_CONTENT.content);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Buscar conteúdo personalizado do banco
    const fetchWelcomeContent = async () => {
      try {
        console.log("🔄 WelcomeSection: Buscando conteúdo...");
        const response = await fetch('/api/admin/content/home');
        
        if (response.ok) {
          const data = await response.json();
          console.log("📥 WelcomeSection: Dados recebidos:", data);
          
          if (data.content?.welcome) {
            console.log("✅ WelcomeSection: Usando conteúdo personalizado");
            
            // Atualizar title se existir
            if (data.content.welcome.title) {
              setTitle(data.content.welcome.title);
            }
            
            // Atualizar content se existir
            if (data.content.welcome.content) {
              setContent(data.content.welcome.content);
            }
          } else {
            console.log("ℹ️ WelcomeSection: Usando conteúdo padrão (nenhum salvo)");
          }
        } else {
          console.log("⚠️ WelcomeSection: Resposta não OK, usando padrão");
        }
      } catch (error) {
        console.log("❌ WelcomeSection: Erro ao buscar, usando padrão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWelcomeContent();
  }, []);
  return (
    <section id="saiba-mais" className="welcome-section">
      <div className="content-container">
        <div className="welcome-container">
          <div className="welcome-text">
            <div className="section-header">
              <h1 className="section-title">
                {isLoading ? (
                  <span className="inline-flex items-center space-x-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground inline-block"></span>
                    <span>Carregando...</span>
                  </span>
                ) : (
                  title
                )}
              </h1>
            </div>
            <div className="welcome-content">
              <article>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="animate-pulse bg-gray-300 h-4 rounded w-full"></div>
                    <div className="animate-pulse bg-gray-300 h-4 rounded w-3/4"></div>
                    <div className="animate-pulse bg-gray-300 h-4 rounded w-full"></div>
                  </div>
                ) : (
                  parseMarkdownToJSX(content)
                )}
              </article>
            </div>
          </div>

          <div className="welcome-image">
            <Image
              src="/assets/michel1.svg"
              alt="Foto de Michel Psicologo Clinico"
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
