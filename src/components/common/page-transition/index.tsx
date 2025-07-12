"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./transition.module.css";

interface PageTransitionProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

const PageTransition = ({ children, isDarkMode }: PageTransitionProps) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Se for a montagem inicial, apenas marcamos que já passou
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Inicia a transição
    setIsTransitioning(true);

    // Após 3 s, finaliza a transição
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Conteúdo normal, com fade */}
      <div
        className={`${styles.content} ${
          isTransitioning ? styles.contentHidden : styles.contentVisible
        }`}
      >
        {children}
      </div>

      {/* Loader só aparece durante a transição */}
      {isTransitioning && (
        <div className={styles.loader}>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progress} ${
                isDarkMode ? styles.darkProgress : styles.lightProgress
              }`}
            />
          </div>
          <div className={styles.logoContainer}>
            <Image
              src="/PsiLogo2.svg"
              alt="Logo"
              width={180}
              height={180}
              priority
              className={styles.fadeIn}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PageTransition;
