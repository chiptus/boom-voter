import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import { formatTimeOnly } from "@/lib/timeUtils";
import type { ScheduleArtist } from "@/hooks/useScheduleData";

interface ArtistScheduleBlockProps {
  artist: ScheduleArtist;
  userVote?: number;
  onVote?: (artistId: string, voteType: number) => void;
  compact?: boolean;
}

export const ArtistScheduleBlock = ({ 
  artist, 
  userVote, 
  onVote, 
  compact = false 
}: ArtistScheduleBlockProps) => {
  const getVoteCount = (voteType: number) => {
    return artist.votes.filter(vote => vote.vote_type === voteType).length;
  };

  const handleVote = (voteType: number) => {
    if (onVote) {
      onVote(artist.id, voteType);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:border-purple-400/50 transition-colors">
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="mb-2">
          <Link 
            to={`/artist/${artist.id}`}
            className="text-white font-semibold hover:text-purple-300 transition-colors block"
          >
            {artist.name}
          </Link>
        </div>

        <div className="space-y-1 text-sm text-purple-200">
          {(artist.time_start || artist.time_end) && (
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span className="text-xs">
                {formatTimeOnly(artist.time_start, artist.time_end, true)}
              </span>
            </div>
          )}
          
          {!compact && artist.stage && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{artist.stage}</span>
            </div>
          )}
        </div>

        {onVote && (
          <div className="flex gap-3 mt-2">
            <div 
              className={`flex items-center gap-1 cursor-pointer ${
                userVote === 2 ? 'text-green-400' : 'text-purple-300 hover:text-green-400'
              }`}
              onClick={() => handleVote(2)}
            >
              <Heart className="h-3 w-3" />
              <span className="text-xs">{getVoteCount(2)}</span>
            </div>
            <div 
              className={`flex items-center gap-1 cursor-pointer ${
                userVote === 1 ? 'text-blue-400' : 'text-purple-300 hover:text-blue-400'
              }`}
              onClick={() => handleVote(1)}
            >
              <ThumbsUp className="h-3 w-3" />
              <span className="text-xs">{getVoteCount(1)}</span>
            </div>
            <div 
              className={`flex items-center gap-1 cursor-pointer ${
                userVote === -1 ? 'text-red-400' : 'text-purple-300 hover:text-red-400'
              }`}
              onClick={() => handleVote(-1)}
            >
              <ThumbsDown className="h-3 w-3" />
              <span className="text-xs">{getVoteCount(-1)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};