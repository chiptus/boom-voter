
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, X, ExternalLink, Play, Music, MapPin, Calendar, Eye, EyeOff, Edit } from "lucide-react";
import { ArtistImageLoader } from "./ArtistImageLoader";
import { EditArtistDialog } from "./EditArtistDialog";
import { useToast } from "@/hooks/use-toast";
import type { Artist } from "@/hooks/useArtists";

interface ArtistCardProps {
  artist: Artist;
  userVote?: number;
  userKnowledge?: boolean;
  votingLoading?: boolean;
  onVote: (artistId: string, voteType: number) => Promise<{ requiresAuth: boolean }>;
  onKnowledgeToggle: (artistId: string) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
  onEditSuccess?: () => void;
  user?: any;
}

export const ArtistCard = ({ artist, userVote, userKnowledge, votingLoading, onVote, onKnowledgeToggle, onAuthRequired, onEditSuccess, user }: ArtistCardProps) => {
  const { toast } = useToast();

  const handleVote = async (voteType: number) => {
    const result = await onVote(artist.id, voteType);
    if (result.requiresAuth) {
      onAuthRequired();
    }
  };

  const handleKnowledgeToggle = async () => {
    const result = await onKnowledgeToggle(artist.id);
    if (result.requiresAuth) {
      onAuthRequired();
    } else {
      // Show toast notification
      const newKnowledgeState = !userKnowledge;
      toast({
        title: `${artist.name} is ${newKnowledgeState ? 'known' : 'unknown'}`,
        duration: 2000,
      });
    }
  };

  const getVoteCount = (voteType: number) => {
    return artist.votes.filter(vote => vote.vote_type === voteType).length;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        {/* Artist Image */}
        <ArtistImageLoader 
          src={artist.image_url}
          alt={artist.name}
          className="aspect-square w-full mb-4 overflow-hidden rounded-lg"
        />
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-white text-xl">{artist.name}</CardTitle>
              {/* Artist Knowledge Eye Icon moved next to title */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleKnowledgeToggle}
                className={`p-1 h-6 w-6 ${userKnowledge ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}
                title={userKnowledge ? "I know this artist" : "Mark as known"}
              >
                {userKnowledge ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
            </div>
            
            {artist.music_genres && (
              <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 mb-2">
                {artist.music_genres.name}
              </Badge>
            )}
            
            {/* Stage and Date Information */}
            <div className="flex flex-wrap gap-2 mb-2">
              {artist.stage && (
                <div className="flex items-center gap-1 text-sm text-purple-200">
                  <MapPin className="h-3 w-3" />
                  <span>{artist.stage}</span>
                </div>
              )}
              {artist.estimated_date && (
                <div className="flex items-center gap-1 text-sm text-purple-200">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(artist.estimated_date)}</span>
                </div>
              )}
            </div>
           </div>
         </div>
         
         {artist.description && (
           <CardDescription className="text-purple-200 text-sm leading-relaxed">
             {artist.description}
           </CardDescription>
         )}
       </CardHeader>
       
       <CardContent className="space-y-4">
          {/* Updated 3-Level Voting System with new vote types */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant={userVote === 2 ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote(2)}
                disabled={votingLoading}
                className={userVote === 2 ? "bg-orange-600 hover:bg-orange-700" : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"}
              >
                <Star className="h-4 w-4 mr-1" />
                Must go ({getVoteCount(2)})
              </Button>
              {votingLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={userVote === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote(1)}
                disabled={votingLoading}
                className={userVote === 1 ? "bg-blue-600 hover:bg-blue-700" : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"}
              >
                <Heart className="h-4 w-4 mr-1" />
                Interested ({getVoteCount(1)})
              </Button>
              {votingLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={userVote === -1 ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote(-1)}
                disabled={votingLoading}
                className={userVote === -1 ? "bg-gray-600 hover:bg-gray-700" : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"}
              >
                <X className="h-4 w-4 mr-1" />
                Won't go ({getVoteCount(-1)})
              </Button>
              {votingLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />}
            </div>
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* View Details Button */}
          <Button asChild variant="outline" className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
            <Link to={`/artist/${artist.id}`}>
              View Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          
          {/* Edit Button - only show for authenticated users */}
          {user && (
            <EditArtistDialog
              artist={artist}
              onSuccess={onEditSuccess}
              trigger={
                <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
