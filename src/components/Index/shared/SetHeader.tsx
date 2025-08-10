import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Users } from "lucide-react";

interface SetHeaderProps {
  setName: string;
  artistCount?: number;
  userKnowledge?: boolean;
  onKnowledgeToggle: () => void;
  socialPlatforms?: {
    spotify: number;
    soundcloud: number;
  };
  size?: "sm" | "lg";
}

export function SetHeader({
  setName,
  artistCount,
  userKnowledge,
  onKnowledgeToggle,
  socialPlatforms,
  size = "lg",
}: SetHeaderProps) {
  const titleClass =
    size === "sm"
      ? "text-white text-lg font-semibold truncate"
      : "text-white text-xl";

  return (
    <div className="flex items-center gap-2 mb-2">
      <CardTitle className={titleClass}>{setName}</CardTitle>

      {!!(artistCount && artistCount > 1) && (
        <Badge
          variant="secondary"
          className="bg-purple-600/50 text-purple-100 text-xs"
        >
          <Users className="h-3 w-3 mr-1" />
          {artistCount}
        </Badge>
      )}

      {/* Knowledge Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onKnowledgeToggle}
        className={`p-1 h-6 w-6 ${
          userKnowledge
            ? "text-purple-400 hover:text-purple-300"
            : "text-purple-600 hover:text-purple-500"
        }`}
        title={userKnowledge ? "I know this artist" : "Mark as known"}
      >
        {userKnowledge ? (
          <Eye className="h-3 w-3" />
        ) : (
          <EyeOff className="h-3 w-3" />
        )}
      </Button>

      {/* Social Platform Badges */}
      {!!(socialPlatforms?.spotify && socialPlatforms.spotify > 0) && (
        <Badge
          variant="secondary"
          className="bg-green-600/20 text-green-400 text-xs border-green-400/30"
        >
          Spotify{" "}
          {socialPlatforms.spotify > 1 && `(${socialPlatforms.spotify})`}
        </Badge>
      )}
      {!!(socialPlatforms?.soundcloud && socialPlatforms.soundcloud > 0) && (
        <Badge
          variant="secondary"
          className="bg-orange-600/20 text-orange-400 text-xs border-orange-400/30"
        >
          SoundCloud{" "}
          {socialPlatforms.soundcloud > 1 && `(${socialPlatforms.soundcloud})`}
        </Badge>
      )}
    </div>
  );
}
