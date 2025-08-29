import { DEFAULT_DIVISORIAS_CONTENT } from "@/utils/default-content";

export interface DivisoriaData {
  text: string;
  backgroundImage: string;
}

export async function getDivisoriasContent(): Promise<DivisoriaData[]> {
  // Dados padrão como fallback
  const defaultQuotes: DivisoriaData[] = [
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

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/content/divisorias`,
      {
        next: {
          tags: ["divisorias-content"],
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      if (data.content) {
        // Converter dados do CMS para o formato esperado
        return [
          {
            text: data.content.divisoria_1?.text || defaultQuotes[0].text,
            backgroundImage:
              data.content.divisoria_1?.backgroundImage || defaultQuotes[0].backgroundImage,
          },
          {
            text: data.content.divisoria_2?.text || defaultQuotes[1].text,
            backgroundImage:
              data.content.divisoria_2?.backgroundImage || defaultQuotes[1].backgroundImage,
          },
          {
            text: data.content.divisoria_3?.text || defaultQuotes[2].text,
            backgroundImage:
              data.content.divisoria_3?.backgroundImage || defaultQuotes[2].backgroundImage,
          },
          {
            text: data.content.divisoria_4?.text || defaultQuotes[3].text,
            backgroundImage:
              data.content.divisoria_4?.backgroundImage || defaultQuotes[3].backgroundImage,
          },
          {
            text: data.content.divisoria_5?.text || defaultQuotes[4].text,
            backgroundImage:
              data.content.divisoria_5?.backgroundImage || defaultQuotes[4].backgroundImage,
          },
          {
            text: data.content.divisoria_6?.text || defaultQuotes[5].text,
            backgroundImage:
              data.content.divisoria_6?.backgroundImage || defaultQuotes[5].backgroundImage,
          },
        ];
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Divisorias content fetch timeout (3s) - using fallback");
      } else {
        console.error("Divisorias content fetch error:", error.message);
      }
    }
  }

  return defaultQuotes;
}
