// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./styles.css";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import { robotoBold } from "@/app/fonts";

const clinicImages = [
  {
    src: "https://picsum.photos/600/500",
    alt: "Espaço de Consultório - Área de Acolhimento",
    description:
      "Ambiente acolhedor e tranquilo projetado para proporcionar conforto e segurança.",
  },
  {
    src: "https://picsum.photos/600/500",
    alt: "Espaço de Consultório - Sala de Terapia",
    description:
      "Sala de terapia com iluminação natural e design minimalista para promover relaxamento.",
  },
  {
    src: "https://picsum.photos/600/500",
    alt: "Espaço de Consultório - Detalhes de Ambiente",
    description:
      "Detalhes cuidadosamente selecionados para criar uma atmosfera de paz e bem-estar.",
  },
  {
    src: "https://picsum.photos/600/500",
    alt: "Espaço de Consultório - Área de Espera",
    description:
      "Área de espera confortável e discreta, pensada para seu acolhimento.",
  },
  {
    src: "https://picsum.photos/600/500",
    alt: "Espaço de Consultório - Vista Geral",
    description:
      "Ambiente projetado para proporcionar uma experiência terapêutica completa.",
  },
];
export default function SwiperUi() {
  return (
    <div className="container">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {clinicImages.map((image, index) => (
          <SwiperSlide key={index} className="text-center">
            <div className="flex flex-col items-center">
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-[600px] w-auto object-cover rounded-xl shadow-lg mb-6"
              />
              <p
                className={cn(
                  "text-lg text-gray-700 max-w-xl mx-auto px-4",
                  robotoBold.className
                )}
              >
                {image.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
