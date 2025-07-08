import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Music, Heart, LogIn } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { Navigation } from "./AppHeader/Navigation";
import { UserMenu } from "./AppHeader/UserMenu";
import { AdminActions } from "./AppHeader/AdminActions";

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
  showGroupsButton?: boolean;
  
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
  showGroupsButton = false,
  children
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const { canEditArtists } = useGroups();
  const [canEdit, setCanEdit] = useState(false);
  const isMobile = useIsMobile();
  const { data: profile } = useProfileQuery(user?.id);

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

  const handleBackClick = () => {
    navigate(backTo);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = profile?.username || user?.email?.split('@')[0] || 'there';

  return (
    <TooltipProvider>
      <div className="mb-8">
        {/* Top Bar - App Branding, User Identity & Navigation */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-purple-400/20">
          {/* Left Side - Branding */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Music className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">UpLine</h1>
            </div>
            
            {/* User Greeting - Desktop Only */}
            {user && !isMobile && (
              <div className="flex items-center gap-3 pl-4 border-l border-purple-400/20">
                <span className="text-purple-200 text-sm">
                  {getGreeting()}, {displayName}! 🎶
                </span>
              </div>
            )}
          </div>
          
          {/* Right Side - Navigation & User Actions */}
          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <Navigation
              showBackButton={showBackButton}
              backTo={backTo}
              backLabel={backLabel}
              showScheduleButton={showScheduleButton}
              showGroupsButton={showGroupsButton}
              user={user}
              isMobile={isMobile}
              onBackClick={handleBackClick}
            />
            
            {/* Admin Actions */}
            {user && (
              <div className="flex items-center gap-3">
                <AdminActions
                  canEdit={canEdit}
                  onAddArtist={onAddArtist}
                  onAddGenre={onAddGenre}
                  isMobile={isMobile}
                />
                
                {/* Divider before user menu */}
                {canEdit && (onAddArtist || onAddGenre) && (
                  <div className="h-4 w-px bg-purple-400/20" />
                )}
              </div>
            )}
            
            {/* Authentication - User Menu or Sign In */}
            <div className="flex items-center">
              {user ? (
                onSignOut && (
                  <UserMenu
                    user={user}
                    profile={profile}
                    onSignOut={onSignOut}
                    isMobile={isMobile}
                  />
                )
              ) : (
                onSignIn && (
                  <Button 
                    onClick={onSignIn} 
                    size={isMobile ? "sm" : "default"}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full px-6"
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
          <div className="text-center space-y-4">
            {title && (
              <div className="flex items-center justify-center gap-3 mb-6">
                <Music className="h-8 w-8 text-purple-400 animate-pulse" />
                <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
                <Heart className="h-8 w-8 text-pink-400 animate-pulse" />
              </div>
            )}
            
            {subtitle && (
              <p className="text-xl text-purple-200 font-medium mb-4">{subtitle}</p>
            )}
            
            {description && (
              <p className="text-purple-300 mb-6 max-w-2xl mx-auto leading-relaxed">{description}</p>
            )}
            
            {actions && (
              <div className="flex justify-center mb-8">
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