import { useIsMobile } from "@/hooks/use-mobile";
import { AppBranding } from "./AppBranding";
import { FestivalIndicator } from "./FestivalIndicator";
import { UserActions } from "./UserActions";

interface TopBarProps {
  showBackButton?: boolean;
  backLabel?: string;
  showGroupsButton?: boolean;
  onBackClick: () => void;

  // Festival context
  isTitleVisible: boolean;
  logoUrl?: string | null;
  title?: string;
}

export function TopBar({
  showBackButton = false,
  backLabel = "Back",
  showGroupsButton = false,
  onBackClick,
  isTitleVisible,
  logoUrl,
  title,
}: TopBarProps) {
  const isMobile = useIsMobile();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-purple-400/20 flex items-center px-4 py-3 md:py-4">
      <AppBranding isMobile={isMobile} />

      <FestivalIndicator
        isTitleVisible={isTitleVisible}
        logoUrl={logoUrl}
        title={title}
      />

      <UserActions
        showBackButton={showBackButton}
        backLabel={backLabel}
        showGroupsButton={showGroupsButton}
        onBackClick={onBackClick}
        isMobile={isMobile}
      />
    </div>
  );
}
