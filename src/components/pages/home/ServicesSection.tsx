// ============================================
// src/components/pages/home/ServicesSection.tsx
// ============================================

import { getServicesContent } from "@/components/pages/home/services-content";
import { ServicesWithPagination } from "./ServicesWithPagination";

export const ServicesSection = async () => {
  // Buscar conteúdo no servidor com cache otimizado
  const { title, description, cards } = await getServicesContent();
  return (
    <ServicesWithPagination
      title={title}
      description={description}
      cards={cards}
    />
  );
};
