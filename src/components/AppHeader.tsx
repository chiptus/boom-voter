import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Heart } from "lucide-react";

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
  children
}: AppHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {/* Top Bar - App Branding */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-400/20">
        <div className="flex items-center gap-3">
          <Music className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">UpLine</h1>
        </div>
        
        {/* Navigation */}
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