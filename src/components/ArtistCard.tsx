
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
import { Star, Heart, X, Play, Music, MapPin, Calendar, Eye, EyeOff, Edit, Trash, MoreHorizontal } from "lucide-react";
import { ArtistImageLoader } from "./ArtistImageLoader";
import { EditArtistDialog } from "./EditArtistDialog";
import { ArchiveArtistDialog } from "./ArchiveArtistDialog";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { useState, useEffect } from "react";
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
  onArchiveArtist?: (artistId: string) => Promise<void>;
  user?: any;
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
              {artist.spotify_url && (
                <Button 
                  asChild 
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 text-green-400 hover:text-green-300"
                  title="Open in Spotify"
                >
                  <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                </Button>
              )}
              {artist.soundcloud_url && (
                <Button 
                  asChild 
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 text-orange-400 hover:text-orange-300"
                  title="Open in SoundCloud"
                >
                  <a href={artist.soundcloud_url} target="_blank" rel="noopener noreferrer">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1.175 12.225c-.051 0-.094.046-.094.105l-.053 2.164.053 2.169c0 .059.043.105.094.105s.094-.046.094-.105l.06-2.169-.06-2.164c0-.059-.043-.105-.094-.105zm1.49-.105c-.055 0-.1.041-.1.098l-.043 2.272.043 2.195c0 .057.045.098.1.098s.1-.041.1-.098l.051-2.195-.051-2.272c0-.057-.045-.098-.1-.098zm1.454-.094c-.058 0-.105.049-.105.109l-.035 2.366.035 2.139c0 .06.047.109.105.109s.105-.049.105-.109l.043-2.139-.043-2.366c0-.06-.047-.109-.105-.109zm1.44-.098c-.062 0-.111.053-.111.117l-.03 2.464.03 2.103c0 .064.049.117.111.117s.111-.053.111-.117l.039-2.103-.039-2.464c0-.064-.049-.117-.111-.117zm1.427-.103c-.066 0-.119.058-.119.128l-.024 2.567.024 2.068c0 .07.053.128.119.128s.119-.058.119-.128l.032-2.068-.032-2.567c0-.07-.053-.128-.119-.128zm1.427-.106c-.069 0-.125.062-.125.138l-.02 2.672.02 2.032c0 .076.056.138.125.138s.125-.062.125-.138l.028-2.032-.028-2.672c0-.076-.056-.138-.125-.138zm1.422-.109c-.073 0-.131.066-.131.148l-.016 2.777.016 1.996c0 .082.058.148.131.148s.131-.066.131-.148l.025-1.996-.025-2.777c0-.082-.058-.148-.131-.148zm1.427-.112c-.077 0-.139.07-.139.156l-.012 2.882.012 1.961c0 .086.062.156.139.156s.139-.07.139-.156l.021-1.961-.021-2.882c0-.086-.062-.156-.139-.156zm1.422-.115c-.08 0-.143.074-.143.165l-.008 2.987.008 1.925c0 .091.063.165.143.165s.143-.074.143-.165l.018-1.925-.018-2.987c0-.091-.063-.165-.143-.165zm1.427-.265c-.084 0-.151.078-.151.174l-.004 3.252.004 1.765c0 .096.067.174.151.174s.151-.078.151-.174l.014-1.765-.014-3.252c0-.096-.067-.174-.151-.174zm1.423-.178c-.087 0-.157.085-.157.19v3.43c0 .105.07.19.157.19s.157-.085.157-.19v-3.43c0-.105-.07-.19-.157-.19zm1.422-.223c-.091 0-.164.089-.164.2v3.653c0 .111.073.2.164.2s.164-.089.164-.2V11.6c0-.111-.073-.2-.164-.2zm1.427-.133c-.095 0-.171.093-.171.208v3.718c0 .115.076.208.171.208s.171-.093.171-.208V11.467c0-.115-.076-.208-.171-.208zm1.422-.181c-.099 0-.178.097-.178.217v4.08c0 .12.079.217.178.217s.178-.097.178-.217v-4.08c0-.12-.079-.217-.178-.217zm1.427-.223c-.103 0-.185.101-.185.226v4.526c0 .125.082.226.185.226s.185-.101.185-.226V11.308c0-.125-.082-.226-.185-.226zm4.114 1.007c-.209 0-.417.058-.598.144-.181-.181-.598-.556-1.294-.556-.467 0-.934.139-1.293.417v3.901c0 .125.082.226.185.226h3c1.108 0 2-.892 2-2s-.892-2-2-2z"/>
                    </svg>
                  </a>
                </Button>
              )}
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
