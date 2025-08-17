import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: "2xl" | "4xl" | "6xl";
  className?: string;
}

export function PageLayout({
  children,
  maxWidth = "4xl",
  className = "",
}: PageLayoutProps) {
  const maxWidthClass = {
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
  };

  return (
    <div className={`min-h-full bg-black text-white ${className}`}>
      <div className={`container mx-auto px-4 py-6 ${maxWidthClass[maxWidth]}`}>
        {children}
      </div>
    </div>
  );
}
