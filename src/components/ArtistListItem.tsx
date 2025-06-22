
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, X, ExternalLink, Play, Music, MapPin, Calendar, Eye, EyeOff, Edit } from "lucide-react";
import { ArtistImageLoader } from "./ArtistImageLoader";
import { EditArtistDialog } from "./EditArtistDialog";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { useState, useEffect } from "react";
import type { Artist } from "@/hooks/useArtists";

interface ArtistListItemProps {
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

export const ArtistListItem = ({ artist, userVote, userKnowledge, votingLoading, onVote, onKnowledgeToggle, onAuthRequired, onEditSuccess, user }: ArtistListItemProps) => {
  const { toast } = useToast();
  const { canEditArtists } = useGroups();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      if (user) {
        const hasPermission = await canEditArtists();
        setCanEdit(hasPermission);
      } else {
        setCanEdit(false);
      }
    };
    checkPermissions();
  }, [user, canEditArtists]);

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
    <div className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 rounded-lg p-4">
      {/* Mobile Layout (sm and below) */}
      <div className="block md:hidden space-y-3">
        {/* Top Row: Image + Basic Info */}
        <div className="flex items-start gap-3">
          <ArtistImageLoader 
            src={artist.image_url}
            alt={artist.name}
            className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white text-base font-semibold truncate">{artist.name}</h3>
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
            
            <div className="flex flex-wrap items-center gap-1 mt-1">
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

        {/* Description */}
        {artist.description && (
          <p className="text-purple-200 text-sm line-clamp-2">
            {artist.description}
          </p>
        )}

        {/* Voting Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={userVote === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote(2)}
            disabled={votingLoading}
            className={`text-xs ${userVote === 2 ? "bg-orange-600 hover:bg-orange-700" : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"}`}
            title="Must go"
          >
            <Star className="h-3 w-3 mr-1" />
            {getVoteCount(2)}
          </Button>
          <Button
            variant={userVote === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote(1)}
            disabled={votingLoading}
            className={`text-xs ${userVote === 1 ? "bg-blue-600 hover:bg-blue-700" : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"}`}
            title="Interested"
          >
            <Heart className="h-3 w-3 mr-1" />
            {getVoteCount(1)}
          </Button>
          <Button
            variant={userVote === -1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote(-1)}
            disabled={votingLoading}
            className={`text-xs ${userVote === -1 ? "bg-gray-600 hover:bg-gray-700" : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"}`}
            title="Won't go"
          >
            <X className="h-3 w-3 mr-1" />
            {getVoteCount(-1)}
          </Button>
          {votingLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />}
        </div>

        {/* External Links and Details */}
        <div className="flex flex-wrap items-center gap-2">
          {artist.spotify_url && (
            <Button 
              asChild 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-8"
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
              className="bg-orange-600 hover:bg-orange-700 text-xs px-2 py-1 h-8"
            >
              <a href={artist.soundcloud_url} target="_blank" rel="noopener noreferrer">
                <Music className="h-3 w-3" />
              </a>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-xs px-2 py-1 h-8">
            <Link to={`/artist/${artist.id}`}>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
          {/* Edit Button - only show for Core team members */}
          {canEdit && (
            <EditArtistDialog
              artist={artist}
              onSuccess={onEditSuccess}
              trigger={
                <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-xs px-2 py-1 h-8">
                  <Edit className="h-3 w-3" />
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Desktop Layout (md and above) */}
      <div className="hidden md:flex items-center gap-4">
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
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white text-lg font-semibold truncate">{artist.name}</h3>
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
          
          {artist.description && (
            <p className="text-purple-200 text-sm line-clamp-2 mb-2">
              {artist.description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Updated 3-Level Voting System with new vote types */}
          <Button
            variant={userVote === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote(2)}
            disabled={votingLoading}
            className={userVote === 2 ? "bg-orange-600 hover:bg-orange-700" : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"}
            title="Must go"
          >
            <Star className="h-3 w-3 mr-1" />
            {getVoteCount(2)}
          </Button>
          <Button
            variant={userVote === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote(1)}
            disabled={votingLoading}
            className={userVote === 1 ? "bg-blue-600 hover:bg-blue-700" : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"}
            title="Interested"
          >
            <Heart className="h-3 w-3 mr-1" />
            {getVoteCount(1)}
          </Button>
          <Button
            variant={userVote === -1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote(-1)}
            disabled={votingLoading}
            className={userVote === -1 ? "bg-gray-600 hover:bg-gray-700" : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"}
            title="Won't go"
          >
            <X className="h-3 w-3 mr-1" />
            {getVoteCount(-1)}
          </Button>
          {votingLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />}
         
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
         
          {/* Edit Button - only show for Core team members */}
          {canEdit && (
            <EditArtistDialog
              artist={artist}
              onSuccess={onEditSuccess}
              trigger={
                <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                  <Edit className="h-3 w-3" />
                </Button>
              }
            />
          )}
       </div>
     </div>
   </div>
 );
};
