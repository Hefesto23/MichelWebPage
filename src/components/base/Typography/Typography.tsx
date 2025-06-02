// ==========================================
// src/components/base/Typography/Typography.tsx
// ==========================================
import { caveat, roboto, robotoSlab } from "@/app/fonts";
import { cn } from "@/lib/utils";
import React from "react";
import styles from "./Typography.module.css";

export interface TypographyProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "subtitle"
    | "caption"
    | "label"
    | "decorative";
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  font?: "primary" | "heading" | "decorative";
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  component,
  className,
  children,
  align = "left",
  font,
}) => {
  // Determinar o componente HTML a ser usado
  const componentMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    body: "p",
    subtitle: "p",
    caption: "p",
    label: "label",
    decorative: "p",
  };

  const Component = component || componentMap[variant] || "p";

  // Determinar a fonte baseada na variante ou prop
  const getFontClass = () => {
    if (font === "heading") return robotoSlab.className;
    if (font === "decorative") return caveat.className;
    if (font === "primary") return roboto.className;

    // Auto-determinar baseado na variante
    if (["h1", "h2", "h3", "h4"].includes(variant)) return robotoSlab.className;
    if (variant === "decorative") return caveat.className;
    return roboto.className;
  };

  return React.createElement(
    Component,
    {
      className: cn(
        styles.typography,
        styles[variant],
        styles[`align-${align}`],
        getFontClass(),
        className
      ),
    },
    children
  );
};
