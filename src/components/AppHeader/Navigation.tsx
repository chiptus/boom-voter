import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface NavigationProps {
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  showScheduleButton?: boolean;
  showGroupsButton?: boolean;
  user?: any;
  isMobile: boolean;
  onBackClick?: () => void;
}

export const Navigation = ({ 
  showBackButton, 
  backTo = "/", 
  backLabel = "Back",
  showScheduleButton,
  showGroupsButton,
  user,
  isMobile,
  onBackClick
}: NavigationProps) => {
  const TooltipButton = ({ children, tooltip, ...props }: { 
    children: React.ReactNode; 
    tooltip: string; 
    [key: string]: any 
  }) => {
    if (!isMobile) return <Button {...props}>{children}</Button>;
    
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

  return (
    <div className="flex items-center gap-3">
      {/* Back Navigation */}
      {showBackButton && (
        <TooltipButton
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={onBackClick}
          className="border-purple-400/50 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
          tooltip={backLabel}
        >
          <ArrowLeft className="h-4 w-4" />
          {!isMobile && <span className="ml-2">{backLabel}</span>}
        </TooltipButton>
      )}
      
      {/* Schedule Button */}
      {showScheduleButton && (
        <Link to="/schedule">
          <TooltipButton
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="border-purple-400/50 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
            tooltip="View Festival Schedule"
          >
            <Calendar className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Schedule</span>}
          </TooltipButton>
        </Link>
      )}
      
      {/* Groups Button */}
      {showGroupsButton && user && (
        <Link to="/groups">
          <TooltipButton
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="border-purple-400/50 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
            tooltip="View Your Groups"
          >
            <Users className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Groups</span>}
          </TooltipButton>
        </Link>
      )}
    </div>
  );
};