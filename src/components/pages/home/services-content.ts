import { DEFAULT_SERVICES_CONTENT } from "@/utils/default-content";

export interface ServiceCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  order: number;
  active: boolean;
}

export interface ServicesContent {
  title: string;
  description: string;
  cards: ServiceCard[];
}

export async function getServicesContent(): Promise<ServicesContent> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/content/home`,
      {
        next: {
          tags: ["services-content"],
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      if (data.content?.services) {
        return {
          title: data.content.services.title || DEFAULT_SERVICES_CONTENT.title,
          description: data.content.services.description || DEFAULT_SERVICES_CONTENT.description,
          cards: data.content.services.cards || DEFAULT_SERVICES_CONTENT.cards,
        };
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Services content fetch timeout (3s) - using fallback");
      } else {
        console.error("Services content fetch error:", error.message);
      }
    }
  }

  return DEFAULT_SERVICES_CONTENT;
}
