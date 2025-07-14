// src/components/common/page-transition/index.tsx - REFATORADO
"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

const PageTransition = ({ children, isDarkMode }: PageTransitionProps) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Conteúdo com fade */}
      <div
        className={`transition-opacity duration-500 w-full ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {/* Loader durante transição */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center top-20 overflow-hidden">
          {/* Barra de progresso */}
          <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-full h-full animate-progressBarAnimation ${
                isDarkMode ? "bg-[#c4d6ed]" : "bg-[#ffbf9e]"
              }`}
              style={{ left: "-100%" }}
            />
          </div>

          {/* Logo */}
          <div className="relative w-64 h-64 flex items-center justify-center z-10">
            <Image
              src="/PsiLogo2.svg"
              alt="Logo"
              width={180}
              height={180}
              priority
              className="animate-fade-in"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PageTransition;
