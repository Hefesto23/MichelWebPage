import { DEFAULT_WELCOME_CONTENT } from "@/utils/default-content";
import { fetchCmsContent } from "@/lib/cms-fetch";

export interface WelcomeContent {
  title: string;
  content: string;
}

export async function getWelcomeContent(): Promise<WelcomeContent> {
  return fetchCmsContent({
    endpoint: "home",
    cacheTag: "welcome-content",
    fallback: DEFAULT_WELCOME_CONTENT,
    parser: (data) => {
      if (!data.content?.welcome) return DEFAULT_WELCOME_CONTENT;
      
      return {
        title: data.content.welcome.title || DEFAULT_WELCOME_CONTENT.title,
        content: data.content.welcome.content || DEFAULT_WELCOME_CONTENT.content,
      };
    }
  });
}
