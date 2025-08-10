"use client";

import { ImageLargeCard } from "@/components/shared/cards/BaseCard";
import { useState, useEffect } from 'react';

interface Card {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  active: boolean;
}

interface TerapiasContentData {
  title: string;
  description: string;
  cards: Card[];
}

const DEFAULT_CONTENT: TerapiasContentData = {
  title: "Modalidades de Atendimentos",
  description: "Os atendimentos são realizados dentro da visão teórica da Análise do Comportamento, buscando compreender e transformar comportamentos para uma melhor qualidade de vida.",
  cards: [
    {
      id: 1,
      title: "Psicoterapia individual - Presencial",
      description: "Modalidade de atendimento de um paciente através de técnicas personalizadas em encontros presenciais no consultório.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/presencial",
      active: true
    },
    {
      id: 2,
      title: "Psicoterapia individual - On-line",
      description: "Modalidade de terapia que permite o atendimento feito à distância, com todo o conforto e privacidade que você precisa.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/online",
      active: true
    },
    {
      id: 3,
      title: "Plantão Psicológico",
      description: "Serviço de atendimento rápido e pontual, oferecido para pessoas que precisam de suporte emocional imediato e urgente.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/plantao",
      active: true
    }
  ]
};

export const TerapiasContent = () => {
  const [content, setContent] = useState<TerapiasContentData>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  console.log('🔥 TerapiasContent MONTADO - iniciando...');

  useEffect(() => {
    console.log('⚡ TerapiasContent useEffect EXECUTADO!');
    const loadContent = async () => {
      try {
        console.log('🌐 TerapiasContent: Iniciando fetch para /api/admin/content/terapias');
        const response = await fetch('/api/admin/content/terapias');
        console.log('📡 TerapiasContent: Response recebido:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('📥 Dados recebidos no TerapiasContent:', data);
          
          console.log('🔍 Verificando estrutura dos dados:', {
            hasContent: !!data.content,
            contentKeys: data.content ? Object.keys(data.content) : [],
            hasTerapias: !!(data.content && data.content.terapias),
            terapiasKeys: (data.content && data.content.terapias) ? Object.keys(data.content.terapias) : []
          });
          
          if (data.content && Object.keys(data.content).length > 0) {
            console.log('✅ TerapiasContent: Dados existem, processando...');
            let processedContent: TerapiasContentData = DEFAULT_CONTENT;

            // Verificar estrutura do PageEditor (data.content.terapias)
            if (data.content.terapias) {
              console.log('🎯 TerapiasContent: Usando estrutura PageEditor');
              console.log('🎯 data.content.terapias:', data.content.terapias);
              
              processedContent = {
                title: data.content.terapias.title || DEFAULT_CONTENT.title,
                description: data.content.terapias.description || DEFAULT_CONTENT.description,
                cards: data.content.terapias.therapyModalities || DEFAULT_CONTENT.cards
              };
              
              console.log('🎯 processedContent após PageEditor:', processedContent);
            } 
            // Estrutura legacy com cards separados
            else {
              console.log('🔄 TerapiasContent: Usando estrutura legacy');
              processedContent = {
                title: data.content.title || DEFAULT_CONTENT.title,
                description: data.content.description || DEFAULT_CONTENT.description,
                cards: []
              };

              // Processar cards do banco de dados
              const cardKeys = Object.keys(data.content).filter(key => key.startsWith('card_'));
              cardKeys.forEach(key => {
                try {
                  const cardData = JSON.parse(data.content[key]);
                  processedContent.cards.push(cardData);
                } catch (e) {
                  console.error('Error parsing card data:', e);
                }
              });

              // Se não há cards salvos, usar padrão
              if (processedContent.cards.length === 0) {
                processedContent.cards = DEFAULT_CONTENT.cards;
              }
            }

            console.log('💻 Conteúdo processado no TerapiasContent:', processedContent);
            
            // Debug específico das imagens
            console.log('🖼️ Imagens dos cards no TerapiasContent:');
            processedContent.cards.forEach((card, index) => {
              console.log(`  Card ${index + 1}: ${card.title} -> ${card.imageUrl}`);
            });
            
            console.log('🔄 TerapiasContent: Chamando setContent...');
            setContent(processedContent);
            console.log('✅ TerapiasContent: setContent executado!');
          }
        } else {
          console.log('❌ TerapiasContent: Response não OK:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('💥 TerapiasContent: Erro no fetch:', error);
      } finally {
        console.log('🏁 TerapiasContent: setLoading(false) chamado');
        setLoading(false);
      }
    };

    console.log('🚀 TerapiasContent chamando loadContent()');
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16 relative z-0 min-h-screen">
        <div className="content-container">
          <div className="relative z-10">
            <div className="section-header animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="grid-pages relative z-[3]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 relative z-0 min-h-screen">
      <div className="content-container">
        <div className="relative z-10">
          <div className="section-header">
            <h2 className="section-title">{content.title}</h2>
            <p className="section-description">{content.description}</p>
          </div>

          <div className="grid-pages relative z-[3]">
            {content.cards
              .filter(card => card.active)
              .map((card) => (
                <ImageLargeCard
                  key={card.id}
                  imageUrl={card.imageUrl}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};