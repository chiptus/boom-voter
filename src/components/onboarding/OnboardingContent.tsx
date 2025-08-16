import { ReactNode } from "react";

interface OnboardingContentProps {
  children: ReactNode;
}

export function OnboardingContent({ children }: OnboardingContentProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 mt-4 sm:mt-6 min-h-0 relative max-h-[50vh]">
      {/* Fade indicator at bottom for desktop */}
      <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 pointer-events-none z-10 rounded-b-lg"></div>
      {children}
    </div>
  );
}
