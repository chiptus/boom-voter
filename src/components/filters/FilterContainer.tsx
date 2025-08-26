import { ReactNode } from "react";

interface FilterContainerProps {
  children: ReactNode;
}

export function FilterContainer({ children }: FilterContainerProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg p-4">
      {children}
    </div>
  );
}
