"use client";

import { DEFAULT_DIVISORIAS_CONTENT } from "@/utils/default-content";
import { useEffect, useState } from "react";

interface DivisoriaData {
  text: string;
  backgroundImage: string;
}

const Divisor = ({ index = 0 }) => {
  const [divisoriasData, setDivisoriasData] = useState<DivisoriaData[]>([]);
  const [loading, setLoading] = useState(true);

  // Dados padrão como fallback
  const defaultQuotes = [
    {
      text: DEFAULT_DIVISORIAS_CONTENT.divisoria_1.text,
      backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_1.backgroundImage,
    },
    {
      text: DEFAULT_DIVISORIAS_CONTENT.divisoria_2.text,
      backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_2.backgroundImage,
    },
    {
      text: DEFAULT_DIVISORIAS_CONTENT.divisoria_3.text,
      backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_3.backgroundImage,
    },
    {
      text: DEFAULT_DIVISORIAS_CONTENT.divisoria_4.text,
      backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_4.backgroundImage,
    },
    {
      text: DEFAULT_DIVISORIAS_CONTENT.divisoria_5.text,
      backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_5.backgroundImage,
    },
    {
      text: DEFAULT_DIVISORIAS_CONTENT.divisoria_6.text,
      backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_6.backgroundImage,
    },
  ];

  useEffect(() => {
    const fetchDivisorias = async () => {
      try {
        const response = await fetch("/api/admin/content/divisorias");
        if (response.ok) {
          const data = await response.json();
          
          if (data.content) {
            // Converter dados do CMS para o formato esperado
            const cmsData = [
              {
                text: data.content.divisoria_1?.text || defaultQuotes[0].text,
                backgroundImage: data.content.divisoria_1?.backgroundImage || defaultQuotes[0].backgroundImage,
              },
              {
                text: data.content.divisoria_2?.text || defaultQuotes[1].text,
                backgroundImage: data.content.divisoria_2?.backgroundImage || defaultQuotes[1].backgroundImage,
              },
              {
                text: data.content.divisoria_3?.text || defaultQuotes[2].text,
                backgroundImage: data.content.divisoria_3?.backgroundImage || defaultQuotes[2].backgroundImage,
              },
              {
                text: data.content.divisoria_4?.text || defaultQuotes[3].text,
                backgroundImage: data.content.divisoria_4?.backgroundImage || defaultQuotes[3].backgroundImage,
              },
              {
                text: data.content.divisoria_5?.text || defaultQuotes[4].text,
                backgroundImage: data.content.divisoria_5?.backgroundImage || defaultQuotes[4].backgroundImage,
              },
              {
                text: data.content.divisoria_6?.text || defaultQuotes[5].text,
                backgroundImage: data.content.divisoria_6?.backgroundImage || defaultQuotes[5].backgroundImage,
              },
            ];
            setDivisoriasData(cmsData);
          } else {
            // Se não houver dados no CMS, usar padrões
            setDivisoriasData(defaultQuotes);
          }
        } else {
          // Em caso de erro na API, usar padrões
          setDivisoriasData(defaultQuotes);
        }
      } catch (error) {
        console.error("Erro ao buscar divisórias:", error);
        setDivisoriasData(defaultQuotes);
      } finally {
        setLoading(false);
      }
    };

    fetchDivisorias();
  }, []);

  // Usar dados padrões enquanto carrega
  const quotes = loading ? defaultQuotes : divisoriasData;
  const safeIndex = index % quotes.length;
  const quote = quotes[safeIndex];

  return (
    <div className="relative h-96 w-full overflow-hidden">
      <div
        className="parallax-bg absolute inset-0 h-[120%] -top-[10%] bg-center bg-cover will-change-transform"
        style={{
          backgroundImage: `url('${quote.backgroundImage}')`,
          transform: "translate3d(0, 0, 0)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      <div className="relative h-full flex flex-col items-center justify-center text-center z-10" 
           style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl" 
             style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <blockquote>
            <p className="font-serif text-white leading-relaxed text-center" 
               style={{ 
                 fontSize: 'clamp(1.125rem, 4vw, 1.875rem)'
               }}>
              {quote.text}
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Divisor;
