import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Users } from "lucide-react";
import { SocialPlatformLinkList } from "./SocialPlatformLinkList";

interface Artist {
  id: string;
  name: string;
  spotify_url?: string | null;
  soundcloud_url?: string | null;
}

interface SetHeaderProps {
  setName: string;
  artists?: Artist[];
  artistCount?: number;
  userKnowledge?: boolean;
  onKnowledgeToggle: () => void;
  size?: "sm" | "lg";
}

export function SetHeader({
  setName,
  artists,
  artistCount,
  userKnowledge,
  onKnowledgeToggle,
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

      {/* Social Platform Links */}
      {artists && artists.length === 1 && (
        <SocialPlatformLinkList
          artist={artists[0]}
          size={size == "sm" ? "sm" : "md"}
        />
      )}
    </div>
  );
}
