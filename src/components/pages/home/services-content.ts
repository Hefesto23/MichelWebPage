import { DEFAULT_SERVICES_CONTENT } from "@/utils/default-content";
import { fetchCmsContent } from "@/lib/cms-fetch";

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
  return fetchCmsContent({
    endpoint: "home",
    cacheTag: "services-content",
    fallback: DEFAULT_SERVICES_CONTENT,
    parser: (data) => {
      if (!data.content?.services) return DEFAULT_SERVICES_CONTENT;
      
      return {
        title: data.content.services.title || DEFAULT_SERVICES_CONTENT.title,
        description: data.content.services.description || DEFAULT_SERVICES_CONTENT.description,
        cards: data.content.services.cards || DEFAULT_SERVICES_CONTENT.cards,
      };
    }
  });
}
