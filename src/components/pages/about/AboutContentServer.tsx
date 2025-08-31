import { fetchCmsContent } from "@/lib/cms-fetch";
import { DEFAULT_ABOUT_CONTENT } from "@/utils/default-content";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import Image from "next/image";

// Mapeamento de ícones das redes sociais
const socialIcons = {
  Facebook: Facebook,
  Instagram: Instagram,
  Youtube: Youtube,
  Linkedin: Linkedin,
  Music: SiTiktok, // Ícone TikTok da simple-icons
};

interface Network {
  id: string;
  name: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
}

interface SocialMedia {
  title: string;
  description: string;
  networks: Network[];
}

interface AboutContentData {
  title: string;
  subtitle: string;
  content: string;
  profileImage: string;
  socialMedia: SocialMedia;
}

// Server Component que busca dados do CMS com cache otimizado
export const AboutContentServer = async () => {
  const aboutData: AboutContentData = await fetchCmsContent({
    endpoint: "about",
    cacheTag: "about-content",
    fallback: DEFAULT_ABOUT_CONTENT,
    parser: (data) => {
      if (data.content?.about) {
        return data.content.about;
      }
      return DEFAULT_ABOUT_CONTENT;
    }
  });

  return (
    <div className="w-full">
      <div className="flex flex-col xl:flex-row items-start gap-8 mb-12">
        {/* Texto - aparece primeiro em telas ≤1200px */}
        <div className="w-full xl:w-2/3 order-1">
          <div className="xl:max-h-screen xl:overflow-y-auto custom-scrollbar xl:pr-4">
            <h2 className="text-2xl font-bold mb-4">{aboutData.title}</h2>
            <h3 className="text-xl font-bold mb-6">{aboutData.subtitle}</h3>

            <div className="space-y-4 text-gray-800">
              {aboutData.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-lg font-bold leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Imagem - aparece após o texto em telas ≤1200px */}
        <div className="w-full xl:w-1/3 order-2 flex justify-center items-start mb-8 xl:mb-0">
          <Image
            src={aboutData.profileImage}
            alt="Michel - Psicólogo Clínico"
            width={400}
            height={400}
            className="rounded-lg shadow-lg object-contain max-w-full h-auto"
          />
        </div>
      </div>

      {/* Seção Minhas Redes - Abaixo do conteúdo principal */}
      {aboutData.socialMedia && (
        <div className="w-full pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="text-left mb-8 text-gray-800">
            <h3 className="text-2xl font-bold mb-4">
              {aboutData.socialMedia.title}
            </h3>
            <p className="text-lg font-bold leading-relaxed">
              {aboutData.socialMedia.description}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-start gap-6">
            {aboutData.socialMedia.networks
              .filter((network: Network) => network.enabled)
              .map((network: Network) => {
                const IconComponent = socialIcons[network.icon as keyof typeof socialIcons];
                
                return (
                  <a
                    key={network.id}
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-200 dark:border-gray-700 min-w-[120px]"
                  >
                    {IconComponent && (
                      <IconComponent className="w-10 h-10 text-foreground transition-transform duration-300 mb-3" />
                    )}
                    <span className="text-sm font-medium text-foreground transition-transform duration-300 text-center">
                      {network.name}
                    </span>
                  </a>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};