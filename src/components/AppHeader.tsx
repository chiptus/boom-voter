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
  const { user, profile, signOut, showAuthDialog } = useAuth();
  const isMobile = useIsMobile();

  function handleBackClick() {
    navigate(-1);
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  const displayName =
    profile?.username || user?.email?.split("@")[0] || "there";

  return (
    <TooltipProvider>
      <div className="mb-4 md:mb-8">
        {/* Top Bar - App Branding, User Identity & Navigation */}
        <div className="flex items-center justify-between mb-3 md:mb-6 pb-3 md:pb-6 border-b border-purple-400/20">
          {/* Left Side - Branding */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <div className="flex items-center gap-3">
                <Music className="h-6 w-6 text-purple-400" />
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  UpLine
                </h1>
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
        {title && (
          <div className="text-center space-y-2 md:space-y-4">
            {title && (
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-6">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${title} logo`}
                    className="h-20 md:h-32 lg:h-40 w-auto max-w-sm object-contain rounded"
                  />
                ) : (
                  <>
                    <Music className="h-6 md:h-8 w-6 md:w-8 text-purple-400 animate-pulse md:block hidden" />
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight hidden md:block">
                      {title}
                    </h2>
                    <Heart className="h-6 md:h-8 w-6 md:w-8 text-pink-400 animate-pulse md:block hidden" />
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {/* Page Content Section
        {(title || subtitle || description || children) && (
          <div className="text-center space-y-2 md:space-y-4">
            {title && (
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-6">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${title} logo`}
                    className="h-20 md:h-32 lg:h-40 w-auto max-w-sm object-contain rounded"
                  />
                ) : (
                  <>
                    <Music className="h-6 md:h-8 w-6 md:w-8 text-purple-400 animate-pulse md:block hidden" />
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight hidden md:block">
                      {title}
                    </h2>
                    <Heart className="h-6 md:h-8 w-6 md:w-8 text-pink-400 animate-pulse md:block hidden" />
                  </>
                )}
              </div>
            )}

            {subtitle && (
              <p className="text-lg md:text-xl text-purple-200 font-medium mb-2 md:mb-4">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-sm md:text-base text-purple-300 mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}

            {actions && (
              <div className="flex justify-center mb-4 md:mb-8">{actions}</div>
            )}

            {children}
          </div>
        )} */}
      </div>
    </TooltipProvider>
  );
}
