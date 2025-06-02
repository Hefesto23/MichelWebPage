// ==========================================
// src/components/base/Card/Card.tsx
// ==========================================
import { cn } from "@/lib/utils";
import React from "react";
import styles from "./Card.module.css";

export interface CardProps {
  variant?: "default" | "admin" | "contact" | "image";
  title?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = "default",
  title,
  className,
  children,
  onClick,
}) => {
  return (
    <div
      className={cn(styles.card, styles[variant], className)}
      onClick={onClick}
    >
      {title && <h2 className={styles.cardTitle}>{title}</h2>}
      {children}
    </div>
  );
};
