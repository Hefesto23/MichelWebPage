import { DEFAULT_CLINIC_CONTENT } from "@/utils/default-content";
import { fetchCmsContent } from "@/lib/cms-fetch";

export interface ClinicImage {
  id: number;
  original: string;
  thumbnail: string; // Será igual ao original para simplificar
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
  return fetchCmsContent({
    endpoint: "home",
    cacheTag: "clinic-content",
    fallback: DEFAULT_CLINIC_CONTENT,
    parser: (data) => {
      if (!data.content?.clinic) return DEFAULT_CLINIC_CONTENT;
      
      const clinicData = data.content.clinic;
      
      // Parse das imagens se vier como string JSON
      let clinicImages = DEFAULT_CLINIC_CONTENT.images;
      if (clinicData.images) {
        try {
          clinicImages = typeof clinicData.images === "string"
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
  });
}
