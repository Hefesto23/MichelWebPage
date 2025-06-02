// ==========================================
// src/components/base/Section/Section.tsx
// ==========================================
import { cn } from "@/lib/utils";
import React from "react";
import styles from "./Section.module.css";

export interface SectionProps {
  id?: string;
  variant?:
    | "default"
    | "hero"
    | "fullHeight"
    | "scheduling"
    | "assessment"
    | "contact"
    | "clinic"
    | "welcome";
  className?: string;
  container?: boolean;
  backgroundImage?: string;
  overlay?: boolean;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  variant = "default",
  className,
  container = true,
  backgroundImage,
  overlay = false,
  children,
}) => {
  const style = backgroundImage
    ? { backgroundImage: `url('${backgroundImage}')` }
    : undefined;

  const content = container ? (
    <div className="content-container">{children}</div>
  ) : (
    children
  );

  return (
    <section
      id={id}
      className={cn(styles.section, styles[variant], className)}
      style={style}
    >
      {overlay && <div className={styles.overlay} />}
      {content}
    </section>
  );
};
