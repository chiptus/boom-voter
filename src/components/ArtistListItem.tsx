
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Heart, X, ExternalLink, Play, Music, MapPin, Calendar } from "lucide-react";
import { ArtistImageLoader } from "./ArtistImageLoader";
import type { Artist } from "@/hooks/useArtists";

interface ArtistListItemProps {
  artist: Artist;
  userVote?: number;
  userKnowledge?: boolean;
  onVote: (artistId: string, voteType: number) => Promise<{ requiresAuth: boolean }>;
  onKnowledgeToggle: (artistId: string) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
}

export const ArtistListItem = ({ artist, userVote, userKnowledge, onVote, onKnowledgeToggle, onAuthRequired }: ArtistListItemProps) => {
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
    <div className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 rounded-lg p-4 flex items-center gap-4">
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
            <h3 className="text-white text-lg font-semibold truncate">{artist.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {artist.music_genres && (
                <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 text-xs">
                  {artist.music_genres.name}
                </Badge>
              )}
              {artist.stage && (
                <div className="flex items-center gap-1 text-xs text-purple-200">
                  <MapPin className="h-3 w-3" />
                  <span>{artist.stage}</span>
                </div>
              )}
              {artist.estimated_date && (
                <div className="flex items-center gap-1 text-xs text-purple-200">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(artist.estimated_date)}</span>
                </div>
              )}
            </div>
         </div>
         </div>
         
         {/* Artist Knowledge Checkbox */}
         <div className="flex items-center gap-2 mb-2">
           <Checkbox 
             checked={userKnowledge || false}
             onCheckedChange={handleKnowledgeToggle}
             className="border-purple-400 data-[state=checked]:bg-purple-600"
           />
           <span className="text-purple-200 text-sm">I know this artist</span>
         </div>
         
         {artist.description && (
           <p className="text-purple-200 text-sm line-clamp-2 mb-2">
             {artist.description}
           </p>
         )}
       </div>
       
       {/* Actions */}
       <div className="flex items-center gap-2 flex-shrink-0">
         {/* New 3-Level Voting System */}
         <Button
           variant={userVote === 3 ? "default" : "outline"}
           size="sm"
           onClick={() => handleVote(3)}
           className={userVote === 3 ? "bg-orange-600 hover:bg-orange-700" : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"}
           title="I'm going for sure"
         >
           <Star className="h-3 w-3 mr-1" />
           {getVoteCount(3)}
         </Button>
         <Button
           variant={userVote === 2 ? "default" : "outline"}
           size="sm"
           onClick={() => handleVote(2)}
           className={userVote === 2 ? "bg-blue-600 hover:bg-blue-700" : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"}
           title="Interesting"
         >
           <Heart className="h-3 w-3 mr-1" />
           {getVoteCount(2)}
         </Button>
         <Button
           variant={userVote === 1 ? "default" : "outline"}
           size="sm"
           onClick={() => handleVote(1)}
           className={userVote === 1 ? "bg-gray-600 hover:bg-gray-700" : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"}
           title="Not interesting"
         >
           <X className="h-3 w-3 mr-1" />
           {getVoteCount(1)}
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
        <Button asChild variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
          <Link to={`/artist/${artist.id}`}>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
