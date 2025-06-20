
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import type { Artist } from "@/hooks/useArtists";

interface ArtistCardProps {
  artist: Artist;
  userVote?: number;
  onVote: (artistId: string, voteType: number) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
}

export const ArtistCard = ({ artist, userVote, onVote, onAuthRequired }: ArtistCardProps) => {
  const getVoteCount = (voteType: number) => {
    return artist.votes.filter(vote => vote.vote_type === voteType).length;
  };

  const handleVote = async (voteType: number) => {
    const result = await onVote(artist.id, voteType);
    if (result.requiresAuth) {
      onAuthRequired();
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/20 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white">{artist.name}</CardTitle>
            {artist.description && (
              <CardDescription className="text-purple-200">
                {artist.description}
              </CardDescription>
            )}
          </div>
          <Link to={`/artist/${artist.id}`}>
            <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white hover:bg-purple-600/30">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {artist.music_genres && (
          <Badge variant="secondary" className="w-fit bg-purple-600/50 text-purple-100">
            {artist.music_genres.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant={userVote === 1 ? "default" : "outline"}
            onClick={() => handleVote(1)}
            className={userVote === 1 ? "bg-green-600 hover:bg-green-700" : "border-green-400 text-green-400 hover:bg-green-400 hover:text-white"}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {getVoteCount(1)}
          </Button>
          <Button
            size="sm"
            variant={userVote === -1 ? "default" : "outline"}
            onClick={() => handleVote(-1)}
            className={userVote === -1 ? "bg-red-600 hover:bg-red-700" : "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            {getVoteCount(-1)}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
