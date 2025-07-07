import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ArrowLeft, Music, Heart, Calendar, Plus, LogIn, LogOut, Menu } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppHeaderProps {
  // Navigation
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  
  // Page content
  title?: string;
  subtitle?: string;
  description?: string;
  
  // Actions
  actions?: ReactNode;
  
  // Authentication & Admin Actions
  user?: any;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onAddArtist?: () => void;
  onAddGenre?: () => void;
  showScheduleButton?: boolean;
  
  // Custom content section
  children?: ReactNode;
}

export const AppHeader = ({ 
  showBackButton = false,
  backTo = "/",
  backLabel = "Back",
  title,
  subtitle,
  description,
  actions,
  user,
  onSignIn,
  onSignOut,
  onAddArtist,
  onAddGenre,
  showScheduleButton = false,
  children
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const { canEditArtists } = useGroups();
  const [canEdit, setCanEdit] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkPermissions = async () => {
      if (user) {
        const hasPermission = await canEditArtists();
        setCanEdit(hasPermission);
      } else {
        setCanEdit(false);
      }
    };
    checkPermissions();
  }, [user, canEditArtists]);

  // Helper function to create tooltipped buttons for mobile
  const TooltipButton = ({ children, tooltip, ...props }: { children: React.ReactNode; tooltip: string; [key: string]: any }) => {
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
    <TooltipProvider>
      <div className="sticky top-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 mb-8">
        {/* Top Bar - App Branding & Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-400/20">
          <div className="flex items-center gap-3">
            <Music className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">UpLine</h1>
          </div>
          
          {/* Navigation & Actions */}
          <div className="flex items-center gap-2">
            {/* Navigation Back Button */}
            {showBackButton && (
              <TooltipButton
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                onClick={() => navigate(backTo)}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
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
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  tooltip="View Schedule"
                >
                  <Calendar className="h-4 w-4" />
                  {!isMobile && <span className="ml-2">View Schedule</span>}
                </TooltipButton>
              </Link>
            )}
            
            {/* Admin Actions - Mobile Dropdown or Desktop Buttons */}
            {user && canEdit && (onAddArtist || onAddGenre) && (
              <>
                {isMobile ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                      >
                        <Menu className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-purple-400/20">
                      {onAddArtist && (
                        <Button 
                          onClick={onAddArtist} 
                          variant="ghost" 
                          className="w-full justify-start text-white hover:bg-purple-600"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Artist
                        </Button>
                      )}
                      {onAddGenre && (
                        <Button 
                          onClick={onAddGenre} 
                          variant="ghost" 
                          className="w-full justify-start text-white hover:bg-purple-600"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Genre
                        </Button>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2 border-l border-purple-400/20 pl-2 ml-2">
                    {onAddArtist && (
                      <Button 
                        onClick={onAddArtist} 
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Artist
                      </Button>
                    )}
                    {onAddGenre && (
                      <Button 
                        onClick={onAddGenre} 
                        variant="outline" 
                        size="sm"
                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Genre
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
            
            {/* Authentication Actions */}
            <div className="flex items-center gap-2 border-l border-purple-400/20 pl-2 ml-2">
              {user ? (
                onSignOut && (
                  <TooltipButton
                    onClick={onSignOut} 
                    variant="outline" 
                    size={isMobile ? "sm" : "default"}
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    tooltip="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                    {!isMobile && <span className="ml-2">Sign Out</span>}
                  </TooltipButton>
                )
              ) : (
                onSignIn && (
                  <Button 
                    onClick={onSignIn} 
                    size={isMobile ? "sm" : "default"}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className={isMobile ? "ml-1" : "ml-2"}>
                      {isMobile ? "Sign In" : "Sign In / Sign Up"}
                    </span>
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Page Content Section */}
        {(title || subtitle || description || children) && (
          <div className="text-center">
            {title && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Music className="h-8 w-8 text-purple-400" />
                <h2 className="text-4xl font-bold text-white">{title}</h2>
                <Heart className="h-8 w-8 text-pink-400" />
              </div>
            )}
            
            {subtitle && (
              <p className="text-xl text-purple-200 mb-4">{subtitle}</p>
            )}
            
            {description && (
              <p className="text-sm text-purple-300 mb-6">{description}</p>
            )}
            
            {actions && (
              <div className="flex justify-center mb-6">
                {actions}
              </div>
            )}
            
            {children}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};