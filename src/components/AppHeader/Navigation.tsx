import { Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { PaletteSelector } from "@/components/PaletteSelector";
import { User } from "@supabase/supabase-js";

interface NavigationProps {
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  showGroupsButton?: boolean;
  user?: User;
  isMobile: boolean;
  onBackClick?: () => void;
}

const TooltipButton = ({
  children,
  tooltip,
  isMobile,
  ...props
}: {
  children: React.ReactNode;
  tooltip: string;
  [key: string]: unknown;
  isMobile: boolean;
}) => {
  if (!isMobile) {
    return <Button {...props}>{children}</Button>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...props}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const Navigation = ({
  showBackButton,
  backTo = "/",
  backLabel = "Back",
  showGroupsButton,
  user,
  isMobile,
  onBackClick,
}: NavigationProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Palette Selector */}
      {/* <PaletteSelector /> */}

      {/* Back Navigation */}
      {showBackButton && (
        <TooltipButton
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={onBackClick}
          className="border-purple-400/50 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
          tooltip={backLabel}
          isMobile={isMobile}
        >
          <ArrowLeft className="h-4 w-4" />
          {!isMobile && <span className="ml-2">{backLabel}</span>}
        </TooltipButton>
      )}

      {/* Groups Button */}
      {showGroupsButton && user && (
        <Link to="/groups">
          <TooltipButton
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="border-purple-400/50 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
            tooltip="View Your Groups"
            isMobile={isMobile}
          >
            <Users className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Groups</span>}
          </TooltipButton>
        </Link>
      )}
    </div>
  );
};
