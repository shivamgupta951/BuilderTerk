import type { ReactNode } from "react";

interface BlueTitleProps {
  children: ReactNode;
  className?: string;
}

export function BlueTitle({ children, className }: BlueTitleProps) {
  return (
    <h2
      className={`max-w-55 truncate text-sm font-semibold text-blue-400 ${className ?? ""}`}
    >
      {children ?? "New workspace"}
    </h2>
  );
}
