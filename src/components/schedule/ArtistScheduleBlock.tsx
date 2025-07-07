import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
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
        <div className="flex items-start justify-between mb-2">
          <Link 
            to={`/artist/${artist.id}`}
            className="text-white font-semibold hover:text-purple-300 transition-colors flex-1"
          >
            {artist.name}
          </Link>
          {artist.music_genres && (
            <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 ml-2">
              {artist.music_genres.name}
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-purple-200">
          {artist.formattedTimeRange && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{artist.formattedTimeRange}</span>
            </div>
          )}
          
          {!compact && artist.stage && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{artist.stage}</span>
            </div>
          )}
        </div>

        {onVote && (
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(2)}
              className={`flex items-center gap-1 text-xs ${
                userVote === 2
                  ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                  : 'border-green-400 text-green-400 hover:bg-green-400 hover:text-white'
              }`}
            >
              <Heart className="h-3 w-3" />
              {getVoteCount(2)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(1)}
              className={`flex items-center gap-1 text-xs ${
                userVote === 1
                  ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                  : 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              {getVoteCount(1)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(-1)}
              className={`flex items-center gap-1 text-xs ${
                userVote === -1
                  ? 'bg-red-600 border-red-600 text-white hover:bg-red-700'
                  : 'border-red-400 text-red-400 hover:bg-red-400 hover:text-white'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              {getVoteCount(-1)}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};