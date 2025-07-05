import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Heart, Calendar, Plus, LogIn, LogOut } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";

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

  return (
    <div className="mb-8">
      {/* Top Bar - App Branding & Navigation */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-400/20">
        <div className="flex items-center gap-3">
          <Music className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">UpLine</h1>
        </div>
        
        {/* Navigation & Actions */}
        <div className="flex items-center gap-3">
          {/* Navigation Back Button */}
          {showBackButton && (
            <Button 
              variant="outline" 
              onClick={() => navigate(backTo)}
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
          )}
          
          {/* Schedule Button */}
          {showScheduleButton && (
            <Link to="/schedule">
              <Button 
                variant="outline" 
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </Link>
          )}
          
          {/* Authentication & Admin Actions */}
          {user ? (
            <>
              {canEdit && onAddArtist && (
                <Button onClick={onAddArtist} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Artist
                </Button>
              )}
              {canEdit && onAddGenre && (
                <Button onClick={onAddGenre} variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Genre
                </Button>
              )}
              {onSignOut && (
                <Button onClick={onSignOut} variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </>
          ) : (
            onSignIn && (
              <Button onClick={onSignIn} className="bg-purple-600 hover:bg-purple-700">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In / Sign Up
              </Button>
            )
          )}
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
  );
};