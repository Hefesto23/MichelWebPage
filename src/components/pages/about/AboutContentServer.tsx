import { createPageContentFetcher } from "@/lib/cms-direct";
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

/**
 * ✅ MIGRADO: Agora usa Prisma direto ao invés de HTTP fetch
 * - Funciona durante build (SSG)
 * - Cache infinito com revalidate: false
 * - Revalidação instantânea via revalidateTag('about-content')
 */
export const AboutContentServer = async () => {
  const fetcher = createPageContentFetcher<any>("about", "about-content");
  const rawContent = await fetcher();

  console.log("🔍 AboutContentServer - rawContent recebido:", JSON.stringify(rawContent, null, 2));

  let aboutData: AboutContentData = DEFAULT_ABOUT_CONTENT;

  // Processar dados do banco se existirem
  if (rawContent && Object.keys(rawContent).length > 0) {
    console.log("✅ AboutContentServer - Dados encontrados no banco");

    // Merge dados da seção 'about'
    if (rawContent.about) {
      console.log("📝 AboutContentServer - Processando seção about:", rawContent.about);
      aboutData = {
        ...aboutData,
        ...rawContent.about
      };
    }

    // Processar seção 'social' para montar socialMedia
    if (rawContent.social) {
      const socialData = rawContent.social;
      console.log("🌐 AboutContentServer - Processando seção social:", JSON.stringify(socialData, null, 2));

      // Verificar se networks já existe como array JSON
      let networks: Network[] = DEFAULT_ABOUT_CONTENT.socialMedia.networks;

      if (socialData.networks && Array.isArray(socialData.networks)) {
        console.log("✅ AboutContentServer - Usando networks do banco (JSON array)");
        networks = socialData.networks;
      } else {
        console.log("🔧 AboutContentServer - Montando networks a partir de campos individuais");
        // Montar array networks a partir dos campos individuais do banco
        networks = DEFAULT_ABOUT_CONTENT.socialMedia.networks.map(defaultNetwork => {
          const urlKey = `network${defaultNetwork.id}_url`;
          const enabledKey = `network${defaultNetwork.id}_enabled`;
          const orderKey = `network${defaultNetwork.id}_order`;

          const hasCustomData = socialData[urlKey] || socialData[enabledKey] || socialData[orderKey];

          if (hasCustomData) {
            const customNetwork = {
              ...defaultNetwork,
              url: socialData[urlKey] || defaultNetwork.url,
              enabled: socialData[enabledKey] === "true" || socialData[enabledKey] === true,
              order: socialData[orderKey] ? parseInt(String(socialData[orderKey])) : defaultNetwork.order
            };
            console.log(`  ✅ Network ${defaultNetwork.id} customizado:`, customNetwork);
            return customNetwork;
          }

          console.log(`  ⚠️ Network ${defaultNetwork.id}: usando padrão`);
          return defaultNetwork;
        });
      }

      aboutData.socialMedia = {
        ...DEFAULT_ABOUT_CONTENT.socialMedia,
        title: socialData.title || DEFAULT_ABOUT_CONTENT.socialMedia.title,
        description: socialData.description || DEFAULT_ABOUT_CONTENT.socialMedia.description,
        networks: networks
      };

      console.log("✅ AboutContentServer - socialMedia final:", JSON.stringify(aboutData.socialMedia, null, 2));
    }
  } else {
    console.log("⚠️ AboutContentServer - Usando conteúdo padrão (banco vazio)");
  }

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