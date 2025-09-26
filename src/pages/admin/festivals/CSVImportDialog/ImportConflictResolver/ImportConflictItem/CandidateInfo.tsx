import { Badge } from "@/components/ui/badge";
import { User, ExternalLink } from "lucide-react";
import type { ImportCandidate } from "@/services/csv/conflictDetector";

interface CandidateInfoProps {
  candidate: ImportCandidate;
}

export function CandidateInfo({ candidate }: CandidateInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-blue-600" />
        <span className="font-medium">{candidate.name}</span>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          Import
        </Badge>
      </div>
      {candidate.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {candidate.description}
        </p>
      )}
      <div className="flex gap-2 flex-wrap">
        {candidate.spotify_url && (
          <Badge variant="secondary" className="text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            Spotify
          </Badge>
        )}
        {candidate.soundcloud_url && (
          <Badge variant="secondary" className="text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            SoundCloud
          </Badge>
        )}
        {candidate.genres && candidate.genres.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {candidate.genres.length} genre
            {candidate.genres.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>
    </div>
  );
}
