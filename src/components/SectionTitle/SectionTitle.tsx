import type { ReactNode } from "react";
import "./style.css";

interface SectionTitleProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export default function SectionTitle({
  title,
  children,
  className,
}: SectionTitleProps) {
  return (
    <div className={`wc3-section${className ? ` ${className}` : ""}`}>
      <div className="wc3-section-title">{title}</div>
      {children}
    </div>
  );
}
