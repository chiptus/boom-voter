import { ReactNode, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";
import { TopBar } from "./AppHeader/TopBar";
import { TitleSection } from "./AppHeader/TitleSection";

interface AppHeaderProps {
  // Navigation
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;

  // Page content
  title?: string;
  logoUrl?: string | null;
  subtitle?: string;
  description?: string;

  // Navigation options
  showGroupsButton?: boolean;

  // Custom content section
  children?: ReactNode;
}

export function AppHeader({
  showBackButton = false,
  backLabel = "Back",
  title,
  // subtitle,
  // description,
  logoUrl,
  // actions,
  showGroupsButton = false,
  // children,
}: AppHeaderProps) {
  const navigate = useNavigate();

  // Track visibility of title section for festival context in top bar
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleVisible = useScrollVisibility(titleRef);

  function handleBackClick() {
    navigate(-1);
  }

  return (
    <TooltipProvider>
      <div>
        <TopBar
          showBackButton={showBackButton}
          backLabel={backLabel}
          showGroupsButton={showGroupsButton}
          onBackClick={handleBackClick}
          isTitleVisible={isTitleVisible}
          logoUrl={logoUrl}
          title={title}
        />

        <div className="pt-16 md:pt-20" ref={titleRef}>
          <TitleSection title={title} logoUrl={logoUrl} />
        </div>
      </div>
    </TooltipProvider>
  );
}
