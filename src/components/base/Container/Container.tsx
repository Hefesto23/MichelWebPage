// ==========================================
// src/components/base/Container/Container.tsx
// ==========================================
import { cn } from "@/lib/utils";
import React from "react";
import styles from "./Container.module.css";

export interface ContainerProps {
  variant?: "default" | "hero" | "content" | "admin";
  className?: string;
  centered?: boolean;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  variant = "default",
  className,
  centered = false,
  children,
}) => {
  return (
    <div
      className={cn(
        styles.container,
        styles[variant],
        centered && styles.centered,
        className
      )}
    >
      {children}
    </div>
  );
};
