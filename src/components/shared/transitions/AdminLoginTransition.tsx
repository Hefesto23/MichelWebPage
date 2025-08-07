// src/components/shared/transitions/AdminLoginTransition.tsx
"use client";

import { useEffect, useState } from "react";

interface AdminLoginTransitionProps {
  children: React.ReactNode;
}

export const AdminLoginTransition = ({ children }: AdminLoginTransitionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fade in simples ao montar o componente
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};