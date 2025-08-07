import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface AuthActionButtonsProps {
  user: User;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const AuthActionButtons = ({
  user,
  onSignIn,
  onSignOut,
}: AuthActionButtonsProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8 flex-wrap">
      {user ? (
        <Button
          onClick={onSignOut}
          variant="outline"
          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      ) : (
        <Button
          onClick={onSignIn}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In / Sign Up
        </Button>
      )}
    </div>
  );
};
