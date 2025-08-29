import { DEFAULT_CLINIC_CONTENT } from "@/utils/default-content";

export interface ClinicImage {
  id: number;
  original: string;
  thumbnail: string;
  originalAlt: string;
  originalTitle: string;
  description: string;
  order: number;
  active: boolean;
}

export interface ClinicContent {
  title: string;
  description: string;
  images: ClinicImage[];
}

export async function getClinicContent(): Promise<ClinicContent> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/content/home`,
      {
        next: {
          tags: ["clinic-content"],
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const savedContent = data.content;

      if (savedContent?.clinic) {
        const clinicData = savedContent.clinic;

        // Parse das imagens se vier como string JSON
        let clinicImages = DEFAULT_CLINIC_CONTENT.images;
        if (clinicData.images) {
          try {
            clinicImages =
              typeof clinicData.images === "string"
                ? JSON.parse(clinicData.images)
                : clinicData.images;
          } catch {
            clinicImages = DEFAULT_CLINIC_CONTENT.images;
          }
        }

        return {
          title: clinicData.title || DEFAULT_CLINIC_CONTENT.title,
          description: clinicData.description || DEFAULT_CLINIC_CONTENT.description,
          images: clinicImages,
        };
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Clinic content fetch timeout (3s) - using fallback");
      } else {
        console.error("Clinic content fetch error:", error.message);
      }
    }
  }

  return DEFAULT_CLINIC_CONTENT;
}
