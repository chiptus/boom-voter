
import { Button } from "@/components/ui/button";
import { Plus, LogIn, LogOut } from "lucide-react";

interface AuthActionButtonsProps {
  user: any;
  onAddArtist: () => void;
  onAddGenre: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const AuthActionButtons = ({
  user,
  onAddArtist,
  onAddGenre,
  onSignIn,
  onSignOut,
}: AuthActionButtonsProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8 flex-wrap">
      {user ? (
        <>
          <Button onClick={onAddArtist} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Artist
          </Button>
          <Button onClick={onAddGenre} variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Genre
          </Button>
          <Button onClick={onSignOut} variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <Button onClick={onSignIn} className="bg-purple-600 hover:bg-purple-700">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In / Sign Up
        </Button>
      )}
    </div>
  );
};
