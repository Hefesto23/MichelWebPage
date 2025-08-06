import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useDarkMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Aguarda montagem no cliente para evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Só retorna o valor real após montar no cliente
  const isDarkMode = mounted ? resolvedTheme === "dark" : false;
  
  const toggleDarkMode = () => {
    if (mounted) {
      setTheme(isDarkMode ? "light" : "dark");
    }
  };

  return {
    isDarkMode,
    toggleDarkMode,
    mounted
  } as const;
}