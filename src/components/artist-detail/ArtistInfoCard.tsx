import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ExternalLink, Music, Play, Trash } from "lucide-react";
import { EditArtistDialog } from "@/components/EditArtistDialog";
import { DeleteArtistDialog } from "@/components/DeleteArtistDialog";
import { ArtistVotingButtons } from "./ArtistVotingButtons";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number }[];
};

interface ArtistInfoCardProps {
  artist: Artist;
  canEdit: boolean;
  userVote: number | null;
  netVoteScore: number;
  onVote: (voteType: number) => void;
  getVoteCount: (voteType: number) => number;
  onArtistUpdate: () => void;
  onDeleteArtist?: () => Promise<void>;
}

export const ArtistInfoCard = ({ 
  artist, 
  canEdit, 
  userVote, 
  netVoteScore, 
  onVote, 
  getVoteCount, 
  onArtistUpdate,
  onDeleteArtist 
}: ArtistInfoCardProps) => {
  return (
    <div className="lg:col-span-2">
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-white mb-2">{artist.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                {artist.music_genres && (
                  <Badge variant="secondary" className="bg-purple-600/50 text-purple-100">
                    {artist.music_genres.name}
                  </Badge>
                )}
                {netVoteScore !== 0 && (
                  <Badge variant="outline" className={`${
                    netVoteScore > 0 
                      ? 'border-green-400 text-green-400' 
                      : 'border-red-400 text-red-400'
                  }`}>
                    Score: {netVoteScore > 0 ? '+' : ''}{netVoteScore}
                  </Badge>
                )}
                {canEdit && (
                  <Badge variant="outline" className="border-purple-400 text-purple-400">
                    Core Member
                  </Badge>
                )}
              </div>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <EditArtistDialog
                  artist={artist as any}
                  onSuccess={onArtistUpdate}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Artist
                    </Button>
                  }
                />
                {onDeleteArtist && (
                  <DeleteArtistDialog
                    artist={artist as any}
                    onDelete={onDeleteArtist}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Artist
                      </Button>
                    }
                  />
                )}
              </div>
            )}
          </div>
          {artist.description && (
            <CardDescription className="text-purple-200 text-lg leading-relaxed">
              {artist.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {/* Voting System */}
          <ArtistVotingButtons 
            userVote={userVote}
            onVote={onVote}
            getVoteCount={getVoteCount}
          />

          {/* External Links */}
          {(artist.spotify_url || artist.soundcloud_url) && (
            <div className="flex flex-wrap gap-4">
              {artist.spotify_url && (
                <Button 
                  asChild 
                  className="bg-green-600 hover:bg-green-700"
                >
                  <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4 mr-2" />
                    Open in Spotify
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
              {artist.soundcloud_url && (
                <Button 
                  asChild 
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <a href={artist.soundcloud_url} target="_blank" rel="noopener noreferrer">
                    <Music className="h-4 w-4 mr-2" />
                    Open in SoundCloud
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};