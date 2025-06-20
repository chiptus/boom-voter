
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, ExternalLink, Play, Music, MapPin, Calendar } from "lucide-react";
import { ArtistImageLoader } from "./ArtistImageLoader";
import type { Artist } from "@/hooks/useArtists";

interface ArtistCardProps {
  artist: Artist;
  userVote?: number;
  onVote: (artistId: string, voteType: number) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
}

export const ArtistCard = ({ artist, userVote, onVote, onAuthRequired }: ArtistCardProps) => {
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
    <Card className="boom-card-gradient backdrop-blur-md border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        {/* Artist Image */}
        <ArtistImageLoader 
          src={artist.image_url}
          alt={artist.name}
          className="aspect-square w-full mb-4 overflow-hidden rounded-lg"
        />
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-orange-100 text-xl mb-2">{artist.name}</CardTitle>
            {artist.music_genres && (
              <Badge variant="secondary" className="bg-orange-600/50 text-orange-100 mb-2">
                {artist.music_genres.name}
              </Badge>
            )}
            
            {/* Stage and Date Information */}
            <div className="flex flex-wrap gap-2 mb-2">
              {artist.stage && (
                <div className="flex items-center gap-1 text-sm text-orange-200">
                  <MapPin className="h-3 w-3" />
                  <span>{artist.stage}</span>
                </div>
              )}
              {artist.estimated_date && (
                <div className="flex items-center gap-1 text-sm text-orange-200">
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
          <CardDescription className="text-orange-300 text-sm leading-relaxed">
            {artist.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voting Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={userVote === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote(1)}
            className={userVote === 1 ? "bg-green-600 hover:bg-green-700" : "border-green-400 text-green-400 hover:bg-green-400 hover:text-white"}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {getVoteCount(1)}
          </Button>
          <Button
            variant={userVote === -1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote(-1)}
            className={userVote === -1 ? "bg-red-600 hover:bg-red-700" : "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            {getVoteCount(-1)}
          </Button>
        </div>

        {/* External Links */}
        {(artist.spotify_url || artist.soundcloud_url) && (
          <div className="flex flex-wrap gap-2">
            {artist.spotify_url && (
              <Button 
                asChild 
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-xs"
              >
                <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer">
                  <Play className="h-3 w-3 mr-1" />
                  Spotify
                </a>
              </Button>
            )}
            {artist.soundcloud_url && (
              <Button 
                asChild 
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-xs"
              >
                <a href={artist.soundcloud_url} target="_blank" rel="noopener noreferrer">
                  <Music className="h-3 w-3 mr-1" />
                  SoundCloud
                </a>
              </Button>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Button asChild variant="outline" className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black">
          <Link to={`/artist/${artist.id}`}>
            View Details
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
