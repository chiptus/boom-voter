import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Users } from "lucide-react";
import { SocialPlatformLinkList } from "./SocialPlatformLinkList";
import { useFestivalSet } from "../FestivalSetContext";

interface SetHeaderProps {
  size?: "sm" | "lg";
}

export function SetHeader({ size = "lg" }: SetHeaderProps) {
  const {
    set,
    userKnowledge,
    onKnowledgeToggle,
    onAuthRequired,
    isMultiArtist,
  } = useFestivalSet();

  async function handleKnowledgeToggle() {
    const result = await onKnowledgeToggle(set.id);
    if (result.requiresAuth) {
      onAuthRequired();
    }
  }
  const titleClass =
    size === "sm"
      ? "text-white text-lg font-semibold truncate"
      : "text-white text-xl";

  return (
    <div className="flex items-center gap-2 mb-2">
      <CardTitle className={titleClass}>{set.name}</CardTitle>

      {isMultiArtist && (
        <Badge
          variant="secondary"
          className="bg-purple-600/50 text-purple-100 text-xs"
        >
          <Users className="h-3 w-3 mr-1" />
          {set.artists.length}
        </Badge>
      )}

      {/* Knowledge Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleKnowledgeToggle}
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
      {!isMultiArtist && set.artists.length > 0 && (
        <SocialPlatformLinkList
          artist={set.artists[0]}
          size={size === "sm" ? "sm" : "md"}
        />
      )}
    </div>
  );
}
