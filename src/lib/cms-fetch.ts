interface CmsFetchOptions<T> {
  endpoint: string;
  cacheTag: string;
  fallback: T;
  parser?: (data: any) => T;
  timeout?: number;
}

export async function fetchCmsContent<T>({
  endpoint,
  cacheTag,
  fallback,
  parser,
  timeout = 3000
}: CmsFetchOptions<T>): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    const response = await fetch(`${baseUrl}/api/admin/content/${endpoint}`, {
      next: {
        tags: [cacheTag],
        revalidate: false,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      
      if (parser) {
        return parser(data);
      }
      
      return data.content ? { ...fallback, ...data.content } : fallback;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn(`${cacheTag} fetch timeout (${timeout}ms) - using fallback`);
      } else {
        console.error(`${cacheTag} fetch error:`, error.message);
      }
    }
  }

  return fallback;
}