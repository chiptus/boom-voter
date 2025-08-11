import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Music, Heart, LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollPosition } from "@/hooks/useScrollPosition";
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
  logoUrl?: string | null;

  // Actions
  actions?: ReactNode;

  // Navigation options
  showGroupsButton?: boolean;

  // Custom content section
  children?: ReactNode;
}

export function AppHeader({
  showBackButton = false,
  backLabel = "Back",
  title,
  subtitle,
  description,
  logoUrl,
  actions,
  showGroupsButton = false,
  children,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const { user, profile, signOut, showAuthDialog } = useAuth();
  const isMobile = useIsMobile();
  const { isScrolledPast } = useScrollPosition(200); // Trigger after 200px scroll

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
      {/* Sticky Top Bar - App Branding, User Identity & Navigation */}
      <div className="sticky top-0 z-50 bg-app-gradient/95 backdrop-blur-sm border-b border-purple-400/20">
        <div className="flex items-center justify-between py-4 px-4 sm:px-6">
          {/* Left Side - Branding */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <div className="flex items-center gap-3 transition-all duration-300 ease-in-out">
                {isScrolledPast && logoUrl ? (
                  <>
                    <img
                      src={logoUrl}
                      alt={`${title} logo`}
                      className="h-8 w-auto max-w-32 object-contain rounded"
                    />
                    <h1 className="text-xl font-bold text-white">UpLine</h1>
                  </>
                ) : (
                  <>
                    <Music className="h-6 w-6 text-purple-400" />
                    <h1 className="text-2xl font-bold text-white">UpLine</h1>
                  </>
                )}
              </div>
            </Link>

            {/* User Greeting - Desktop Only */}
            {user && !isMobile && !isScrolledPast && (
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
      </div>

      {/* Page Content Section */}
      {(title || subtitle || description || children) && (
        <div className="text-center space-y-4 mt-8 mb-8 px-4 sm:px-6">
          {title && (
            <div className="flex items-center justify-center gap-3 mb-6">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${title} logo`}
                  className="h-40 w-auto max-w-sm object-contain rounded"
                />
              ) : (
                <>
                  <Music className="h-8 w-8 text-purple-400 animate-pulse" />
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                  <Heart className="h-8 w-8 text-pink-400 animate-pulse" />
                </>
              )}
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

          {actions && <div className="flex justify-center mb-8">{actions}</div>}

          {children}
        </div>
      )}
    </TooltipProvider>
  );
}
