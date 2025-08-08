import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Music, Heart, LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Navigation } from "./AppHeader/Navigation";
import { UserMenu } from "./AppHeader/UserMenu";
import { AdminActions } from "./AppHeader/AdminActions";
import { useAuth } from "@/contexts/AuthContext";

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

  // Navigation options
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
  showGroupsButton = false,
  children,
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const { user, profile, signOut, showAuthDialog } = useAuth();
  const isMobile = useIsMobile();

  const handleBackClick = () => {
    navigate(backTo);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName =
    profile?.username || user?.email?.split("@")[0] || "there";

  return (
    <TooltipProvider>
      <div className="mb-8">
        {/* Top Bar - App Branding, User Identity & Navigation */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-purple-400/20">
          {/* Left Side - Branding */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <div className="flex items-center gap-3">
                <Music className="h-6 w-6 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">UpLine</h1>
              </div>
            </Link>

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
              backLabel={backLabel}
              showGroupsButton={showGroupsButton}
              isMobile={isMobile}
              onBackClick={handleBackClick}
            />

            {/* Admin Actions */}
            {user && (
              <div className="flex items-center gap-3">
                <AdminActions userId={user.id} isMobile={isMobile} />
              </div>
            )}

            {/* Authentication - User Menu or Sign In */}
            <div className="flex items-center">
              {user ? (
                <UserMenu
                  user={user}
                  profile={profile || undefined}
                  onSignOut={signOut}
                  isMobile={isMobile}
                />
              ) : (
                <Button
                  onClick={() => showAuthDialog()}
                  size={isMobile ? "sm" : "default"}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full px-6"
                >
                  <LogIn className="h-4 w-4" />
                  <span className={isMobile ? "ml-1" : "ml-2"}>
                    {isMobile ? "Sign In" : "Sign In / Sign Up"}
                  </span>
                </Button>
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
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  {title}
                </h2>
                <Heart className="h-8 w-8 text-pink-400 animate-pulse" />
              </div>
            )}

            {subtitle && (
              <p className="text-xl text-purple-200 font-medium mb-4">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-purple-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}

            {actions && (
              <div className="flex justify-center mb-8">{actions}</div>
            )}

            {children}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
