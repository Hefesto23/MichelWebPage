import { DEFAULT_WELCOME_CONTENT } from "@/utils/default-content";

export interface WelcomeContent {
  title: string;
  content: string;
}

export async function getWelcomeContent(): Promise<WelcomeContent> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/content/home`,
      {
        next: {
          tags: ["welcome-content"],
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      if (data.content?.welcome) {
        return {
          title: data.content.welcome.title || DEFAULT_WELCOME_CONTENT.title,
          content: data.content.welcome.content || DEFAULT_WELCOME_CONTENT.content,
        };
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Welcome content fetch timeout (3s) - using fallback");
      } else {
        console.error("Welcome content fetch error:", error.message);
      }
    }
  }

  return DEFAULT_WELCOME_CONTENT;
}
