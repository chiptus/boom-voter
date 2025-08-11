import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface GroupsCTAProps {
  onSignInClick?: () => void;
}

export function GroupsCTA({ onSignInClick }: GroupsCTAProps) {
  const { user } = useAuth();

  return (
    <div className="bg-purple-900/30 rounded-lg p-6 mb-6 border border-purple-400/20">
      <div className="flex items-center gap-3 mb-3">
        <Users className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Vote with Friends</h3>
      </div>
      <p className="text-purple-200 mb-4">
        Create or join groups to make voting decisions together and see combined
        results.
      </p>
      {user ? (
        <Link to="/groups">
          <Button className="bg-purple-600 hover:bg-purple-700">
            View My Groups
          </Button>
        </Link>
      ) : (
        <Button
          onClick={onSignInClick}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Sign In to Join Groups
        </Button>
      )}
    </div>
  );
}
