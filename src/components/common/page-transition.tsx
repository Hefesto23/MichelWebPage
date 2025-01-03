"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative">
      {/* Container do conteúdo com fade */}
      <div
        className={`transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {/* Loader que aparece durante a transição */}
      {isTransitioning && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="relative">
            {/* Círculos decorativos */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#ffbf9e]/20 rounded-full" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#ffbf9e]/20 rounded-full" />

            {/* Spinner */}
            <div className="relative flex items-center justify-center">
              <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#ffbf9e]" />
              <div className="absolute animate-ping h-24 w-24 rounded-full bg-[#ffbf9e]/30" />
              <div className="absolute h-16 w-16 rounded-full bg-[#ffbf9e]" />

              <div className="relative text-foreground text-xl font-semibold">
                MC
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTransition;
