// src/components/shared/navigation/LogoutButton.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useState } from "react";

export const LogoutButton = () => {
  const { logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Erro no logout:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading || isLoggingOut}
      className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
      title="Sair do sistema"
    >
      <LogOut className="w-4 h-4" />
      <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
    </button>
  );
};