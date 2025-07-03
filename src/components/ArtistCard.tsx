
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, Heart, X, Play, Music, MapPin, Clock, Eye, EyeOff, Edit, Trash, MoreHorizontal } from "lucide-react";
import { ArtistImageLoader } from "./ArtistImageLoader";
import { EditArtistDialog } from "./EditArtistDialog";
import { ArchiveArtistDialog } from "./ArchiveArtistDialog";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { useState, useEffect } from "react";
import { formatTimeRange } from "@/lib/timeUtils";
import type { Artist } from "@/hooks/useArtists";
import { User } from "@supabase/supabase-js";

interface ArtistCardProps {
  artist: Artist;
  userVote?: number;
  userKnowledge?: boolean;
  votingLoading?: boolean;
  onVote: (artistId: string, voteType: number) => Promise<{ requiresAuth: boolean }>;
  onKnowledgeToggle: (artistId: string) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
  onEditSuccess?: () => void;
  onArchiveArtist?: (artistId: string) => Promise<void>;
  user?: User;
}

export const ArtistCard = ({ artist, userVote, userKnowledge, votingLoading, onVote, onKnowledgeToggle, onAuthRequired, onEditSuccess, onArchiveArtist, user }: ArtistCardProps) => {
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

  const getSocialPlatformLogo = (url: string) => {
    if (url.includes('spotify.com')) {
      return {
        logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png',
        platform: 'Spotify',
        color: 'text-green-400 hover:text-green-300'
      };
    }
    if (url.includes('soundcloud.com')) {
      return {
        logo: 'https://d21buns5ku92am.cloudfront.net/26628/documents/54546-1717072325-sc-logo-cloud-black-7412d7.svg',
        platform: 'SoundCloud', 
        color: 'text-orange-400 hover:text-orange-300'
      };
    }
    return null;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        {/* Artist Image - clickable for details */}
        <Link to={`/artist/${artist.id}`} className="block">
          <ArtistImageLoader 
            src={artist.image_url}
            alt={artist.name}
            className="aspect-square w-full mb-4 overflow-hidden rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          />
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-white text-xl">{artist.name}</CardTitle>
              
              {/* Knowledge Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleKnowledgeToggle}
                className={`p-1 h-6 w-6 ${userKnowledge ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}
                title={userKnowledge ? "I know this artist" : "Mark as known"}
              >
                {userKnowledge ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
              
              {/* Social Links - small icons next to name */}
              {artist.spotify_url && getSocialPlatformLogo(artist.spotify_url) && (
                <Button 
                  asChild 
                  variant="secondary"
                  size="sm"
                  className={`p-1 h-6 w-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 ${getSocialPlatformLogo(artist.spotify_url)?.color}`}
                  title={`Open in ${getSocialPlatformLogo(artist.spotify_url)?.platform}`}
                >
                  <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={getSocialPlatformLogo(artist.spotify_url)?.logo} 
                      alt={`${getSocialPlatformLogo(artist.spotify_url)?.platform} logo`}
                      className="h-3 w-3 object-contain"
                    />
                  </a>
                </Button>
              )}
              {artist.soundcloud_url && getSocialPlatformLogo(artist.soundcloud_url) && (
                <Button 
                  asChild 
                  variant="secondary"
                  size="sm"
                  className={`p-1 h-6 w-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 ${getSocialPlatformLogo(artist.soundcloud_url)?.color}`}
                  title={`Open in ${getSocialPlatformLogo(artist.soundcloud_url)?.platform}`}
                >
                  <a href={artist.soundcloud_url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={getSocialPlatformLogo(artist.soundcloud_url)?.logo} 
                      alt={`${getSocialPlatformLogo(artist.soundcloud_url)?.platform} logo`}
                      className="h-3 w-3 object-contain"
                    />
                  </a>
                </Button>
              )}
            </div>
            
            {artist.music_genres && (
              <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 mb-2">
                {artist.music_genres.name}
              </Badge>
            )}
            
            {/* Stage and Time Information */}
            <div className="flex flex-wrap gap-2 mb-2">
              {artist.stage && (
                <div className="flex items-center gap-1 text-sm text-purple-200">
                  <MapPin className="h-3 w-3" />
                  <span>{artist.stage}</span>
                </div>
              )}
              {formatTimeRange(artist.time_start, artist.time_end) && (
                <div className="flex items-center gap-1 text-sm text-purple-200">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeRange(artist.time_start, artist.time_end)}</span>
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
       
      <CardContent>
        {/* Admin Controls + Voting System */}
        <div className="flex items-start gap-3">
          {/* Core Team Dropdown Menu */}
          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-purple-400 hover:text-purple-300">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-black/90 border-purple-400/30">
                <DropdownMenuItem asChild>
                  <EditArtistDialog
                    artist={artist}
                    onSuccess={onEditSuccess}
                    trigger={
                      <div className="flex items-center gap-2 w-full cursor-pointer text-purple-400 hover:text-purple-300">
                        <Edit className="h-4 w-4" />
                        Edit Artist
                      </div>
                    }
                  />
                </DropdownMenuItem>
                {onArchiveArtist && (
                  <DropdownMenuItem asChild>
                    <ArchiveArtistDialog
                      artist={artist}
                      onArchive={onArchiveArtist}
                      trigger={
                        <div className="flex items-center gap-2 w-full cursor-pointer text-red-400 hover:text-red-300">
                          <Trash className="h-4 w-4" />
                          Archive Artist
                        </div>
                      }
                    />
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Prominent Voting System */}
          <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Button
              variant={userVote === 2 ? "default" : "outline"}
              size="default"
              onClick={() => handleVote(2)}
              disabled={votingLoading}
              className={`flex-1 ${userVote === 2 ? "bg-orange-600 hover:bg-orange-700" : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"}`}
            >
              <Star className="h-4 w-4 mr-2" />
              Must go ({getVoteCount(2)})
            </Button>
            {votingLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={userVote === 1 ? "default" : "outline"}
              size="default"
              onClick={() => handleVote(1)}
              disabled={votingLoading}
              className={`flex-1 ${userVote === 1 ? "bg-blue-600 hover:bg-blue-700" : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"}`}
            >
              <Heart className="h-4 w-4 mr-2" />
              Interested ({getVoteCount(1)})
            </Button>
            {votingLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={userVote === -1 ? "default" : "outline"}
              size="default"
              onClick={() => handleVote(-1)}
              disabled={votingLoading}
              className={`flex-1 ${userVote === -1 ? "bg-gray-600 hover:bg-gray-700" : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"}`}
            >
              <X className="h-4 w-4 mr-2" />
              Won't go ({getVoteCount(-1)})
            </Button>
            {votingLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />}
          </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
