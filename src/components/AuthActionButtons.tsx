
import { Button } from "@/components/ui/button";
import { Plus, LogIn, LogOut, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useGroups } from "@/hooks/useGroups";
import { useState, useEffect } from "react";

interface AuthActionButtonsProps {
  user: any;
  onAddArtist: () => void;
  onAddGenre: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const AuthActionButtons = ({ user, onAddArtist, onAddGenre, onSignIn, onSignOut }: AuthActionButtonsProps) => {
  const { canAddArtists, canAddGenres } = useGroups();
  const [canAdd, setCanAdd] = useState({ artists: false, genres: false });

  useEffect(() => {
    const checkPermissions = async () => {
      if (user) {
        const [artistsPermission, genresPermission] = await Promise.all([
          canAddArtists(),
          canAddGenres()
        ]);
        setCanAdd({ artists: artistsPermission, genres: genresPermission });
      } else {
        setCanAdd({ artists: false, genres: false });
      }
    };
    checkPermissions();
  }, [user, canAddArtists, canAddGenres]);

  if (!user) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <Button
          onClick={onSignIn}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link to="/analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Link>
        </Button>
        
        {canAdd.artists && (
          <Button
            onClick={onAddArtist}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Artist
          </Button>
        )}
        
        {canAdd.genres && (
          <Button
            onClick={onAddGenre}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Genre
          </Button>
        )}
      </div>
      
      <Button
        onClick={onSignOut}
        variant="outline"
        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/20"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};
