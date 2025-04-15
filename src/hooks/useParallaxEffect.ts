import { useEffect } from "react";

/**
 * Hook personalizado para gerenciar o efeito parallax
 * Aplica transformações em elementos com a classe parallax-bg
 * conforme o scroll da página
 */
export const useParallaxEffect = () => {
  useEffect(() => {
    const handleParallax = () => {
      const parallaxElements =
        document.querySelectorAll<HTMLElement>(".parallax-bg");
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < viewportHeight && rect.bottom > 0;

        if (isInView) {
          // Calcula a posição relativa do elemento em relação ao scroll
          const elementTop = rect.top + scrollPosition;
          const relativeScroll = (scrollPosition - elementTop) * 0.3;

          // Aplica a transformação
          element.style.transform = `translate3d(0, ${relativeScroll}px, 0)`;
        }
      });
    };

    // Adiciona o evento de scroll
    window.addEventListener("scroll", handleParallax, { passive: true });

    // Executa uma vez para inicializar
    handleParallax();

    // Cleanup
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);
};
