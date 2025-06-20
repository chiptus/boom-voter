
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, ExternalLink, Play, Music, MapPin, Calendar } from "lucide-react";
import { ArtistImageLoader } from "./ArtistImageLoader";
import type { Artist } from "@/hooks/useArtists";

interface ArtistListItemProps {
  artist: Artist;
  userVote?: number;
  onVote: (artistId: string, voteType: number) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
}

export const ArtistListItem = ({ artist, userVote, onVote, onAuthRequired }: ArtistListItemProps) => {
  const handleVote = async (voteType: number) => {
    const result = await onVote(artist.id, voteType);
    if (result.requiresAuth) {
      onAuthRequired();
    }
  };

  const getVoteCount = (voteType: number) => {
    return artist.votes.filter(vote => vote.vote_type === voteType).length;
  };

  const netVoteScore = getVoteCount(1) - getVoteCount(-1);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="boom-card-gradient backdrop-blur-md border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 rounded-lg p-4 flex items-center gap-4">
      {/* Artist Image */}
      <ArtistImageLoader 
        src={artist.image_url}
        alt={artist.name}
        className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden"
      />
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-orange-100 text-lg font-semibold truncate">{artist.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {artist.music_genres && (
                <Badge variant="secondary" className="bg-orange-600/50 text-orange-100 text-xs">
                  {artist.music_genres.name}
                </Badge>
              )}
              {artist.stage && (
                <div className="flex items-center gap-1 text-xs text-orange-200">
                  <MapPin className="h-3 w-3" />
                  <span>{artist.stage}</span>
                </div>
              )}
              {artist.estimated_date && (
                <div className="flex items-center gap-1 text-xs text-orange-200">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(artist.estimated_date)}</span>
                </div>
              )}
            </div>
          </div>
          {netVoteScore !== 0 && (
            <div className={`text-sm font-semibold px-2 py-1 rounded ${
              netVoteScore > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {netVoteScore > 0 ? '+' : ''}{netVoteScore}
            </div>
          )}
        </div>
        
        {artist.description && (
          <p className="text-orange-300 text-sm line-clamp-2 mb-2">
            {artist.description}
          </p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Voting Buttons */}
        <Button
          variant={userVote === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote(1)}
          className={userVote === 1 ? "bg-green-600 hover:bg-green-700" : "border-green-400 text-green-400 hover:bg-green-400 hover:text-white"}
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          {getVoteCount(1)}
        </Button>
        <Button
          variant={userVote === -1 ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote(-1)}
          className={userVote === -1 ? "bg-red-600 hover:bg-red-700" : "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"}
        >
          <ThumbsDown className="h-3 w-3 mr-1" />
          {getVoteCount(-1)}
        </Button>
        
        {/* External Links */}
        {artist.spotify_url && (
          <Button 
            asChild 
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer">
              <Play className="h-3 w-3" />
            </a>
          </Button>
        )}
        {artist.soundcloud_url && (
          <Button 
            asChild 
            size="sm"
            className="bg-orange-600 hover:bg-orange-700"
          >
            <a href={artist.soundcloud_url} target="_blank" rel="noopener noreferrer">
              <Music className="h-3 w-3" />
            </a>
          </Button>
        )}
        
        {/* View Details Button */}
        <Button asChild variant="outline" size="sm" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black">
          <Link to={`/artist/${artist.id}`}>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
