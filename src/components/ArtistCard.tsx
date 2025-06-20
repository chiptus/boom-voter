
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, ExternalLink, Play, Music } from "lucide-react";
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

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300">
      <CardHeader className="pb-4">
        {/* Artist Image */}
        {artist.image_url && (
          <div className="aspect-square w-full mb-4 overflow-hidden rounded-lg">
            <img 
              src={artist.image_url} 
              alt={artist.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        )}
        
        <CardTitle className="text-white text-xl">{artist.name}</CardTitle>
        {artist.description && (
          <CardDescription className="text-purple-200">
            {artist.description}
          </CardDescription>
        )}
        {artist.music_genres && (
          <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 w-fit">
            {artist.music_genres.name}
          </Badge>
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
        <div className="flex flex-wrap gap-2">
          {artist.spotify_url && (
            <Button 
              asChild 
              size="sm"
              className="bg-green-600 hover:bg-green-700"
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
              className="bg-orange-600 hover:bg-orange-700"
            >
              <a href={artist.soundcloud_url} target="_blank" rel="noopener noreferrer">
                <Music className="h-3 w-3 mr-1" />
                SoundCloud
              </a>
            </Button>
          )}
        </div>

        {/* View Details Button */}
        <Button asChild variant="outline" className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
          <Link to={`/artist/${artist.id}`}>
            View Details
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
