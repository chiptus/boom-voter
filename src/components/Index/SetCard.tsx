import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, X, MapPin, Clock, Eye, EyeOff } from "lucide-react";
import { ArtistImageLoader } from "@/components/ArtistImageLoader";
import { useToast } from "@/hooks/use-toast";
import { formatTimeRange } from "@/lib/timeUtils";
import { FestivalSet } from "@/services/queries";
import { GenreBadge } from "./GenreBadge";

interface ArtistCardProps {
  set: FestivalSet;
  userVote?: number;
  userKnowledge?: boolean;
  votingLoading?: boolean;
  onVote: (
    setId: string,
    voteType: number
  ) => Promise<{ requiresAuth: boolean }>;
  onKnowledgeToggle: (setId: string) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
  use24Hour?: boolean;
}

export const SetCard = ({
  set,
  userVote,
  userKnowledge,
  votingLoading,
  onVote,
  onKnowledgeToggle,
  onAuthRequired,
  use24Hour = false,
}: ArtistCardProps) => {
  const { toast } = useToast();

  const handleVote = async (voteType: number) => {
    const result = await onVote(set.id, voteType);
    if (result.requiresAuth) {
      onAuthRequired();
    }
  };

  const handleKnowledgeToggle = async () => {
    const result = await onKnowledgeToggle(set.id);
    if (result.requiresAuth) {
      onAuthRequired();
    } else {
      // Show toast notification
      const newKnowledgeState = !userKnowledge;
      toast({
        title: `${set.name} is ${newKnowledgeState ? "known" : "unknown"}`,
        duration: 2000,
      });
    }
  };

  const getVoteCount = (voteType: number) => {
    return set.votes.filter((vote) => vote.vote_type === voteType).length;
  };

  const getSocialPlatformLogo = (url: string) => {
    if (url.includes("spotify.com")) {
      return {
        logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
        platform: "Spotify",
        color: "text-green-400 hover:text-green-300",
      };
    }
    if (url.includes("soundcloud.com")) {
      return {
        logo: "https://d21buns5ku92am.cloudfront.net/26628/documents/54546-1717072325-sc-logo-cloud-black-7412d7.svg",
        platform: "SoundCloud",
        color: "text-orange-400 hover:text-orange-300",
      };
    }
    return null;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        {/* Artist Image - clickable for details */}
        <Link to={`/set/${set.id}`} className="block">
          <ArtistImageLoader
            src={set.artists[0]?.image_url}
            alt={set.name}
            className="aspect-square w-full mb-4 overflow-hidden rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          />
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-white text-xl">{set.name}</CardTitle>

              {/* Knowledge Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleKnowledgeToggle}
                className={`p-1 h-6 w-6 ${
                  userKnowledge
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-500"
                }`}
                title={userKnowledge ? "I know this artist" : "Mark as known"}
              >
                {userKnowledge ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>

              {/* Social Links - small icons next to name */}
              {set.artists[0]?.spotify_url &&
                getSocialPlatformLogo(set.artists[0]?.spotify_url) && (
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className={`p-1 h-6 w-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 ${
                      getSocialPlatformLogo(set.artists[0]?.spotify_url)?.color
                    }`}
                    title={`Open in ${
                      getSocialPlatformLogo(set.artists[0]?.spotify_url)
                        ?.platform
                    }`}
                  >
                    <a
                      href={set.artists[0]?.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          getSocialPlatformLogo(set.artists[0]?.spotify_url)
                            ?.logo
                        }
                        alt={`${
                          getSocialPlatformLogo(set.artists[0]?.spotify_url)
                            ?.platform
                        } logo`}
                        className="h-3 w-3 object-contain"
                      />
                    </a>
                  </Button>
                )}
              {set.artists[0]?.soundcloud_url &&
                getSocialPlatformLogo(set.artists[0]?.soundcloud_url) && (
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className={`p-1 h-6 w-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 ${
                      getSocialPlatformLogo(set.artists[0]?.soundcloud_url)
                        ?.color
                    }`}
                    title={`Open in ${
                      getSocialPlatformLogo(set.artists[0]?.soundcloud_url)
                        ?.platform
                    }`}
                  >
                    <a
                      href={set.artists[0]?.soundcloud_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          getSocialPlatformLogo(set.artists[0]?.soundcloud_url)
                            ?.logo
                        }
                        alt={`${
                          getSocialPlatformLogo(set.artists[0]?.soundcloud_url)
                            ?.platform
                        } logo`}
                        className="h-3 w-3 object-contain"
                      />
                    </a>
                  </Button>
                )}
            </div>

            {set.artists
              ?.flatMap((a) => a.artist_music_genres || [])
              .filter(
                (genre, index, self) =>
                  self.findIndex(
                    (g) => g.music_genre_id === genre.music_genre_id
                  ) === index
              )
              .map((genre) => (
                <GenreBadge
                  key={genre.music_genre_id}
                  genreId={genre.music_genre_id}
                />
              ))}

            {/* Stage and Time Information */}
            <div className="flex flex-wrap gap-2 mb-2">
              {set.stages?.name && (
                <div className="flex items-center gap-1 text-sm text-purple-200">
                  <MapPin className="h-3 w-3" />
                  <span>{set.stages.name}</span>
                </div>
              )}
              {formatTimeRange(set.time_start, set.time_end, use24Hour) && (
                <div className="flex items-center gap-1 text-sm text-purple-200">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatTimeRange(set.time_start, set.time_end, use24Hour)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {set.description && (
          <CardDescription className="text-purple-200 text-sm leading-relaxed">
            {set.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {/* Voting System */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              variant={userVote === 2 ? "default" : "outline"}
              size="default"
              onClick={() => handleVote(2)}
              disabled={votingLoading}
              className={`flex-1 ${
                userVote === 2
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
              }`}
            >
              <Star className="h-4 w-4 mr-2" />
              Must go ({getVoteCount(2)})
            </Button>
            {votingLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={userVote === 1 ? "default" : "outline"}
              size="default"
              onClick={() => handleVote(1)}
              disabled={votingLoading}
              className={`flex-1 ${
                userVote === 1
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
              }`}
            >
              <Heart className="h-4 w-4 mr-2" />
              Interested ({getVoteCount(1)})
            </Button>
            {votingLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={userVote === -1 ? "default" : "outline"}
              size="default"
              onClick={() => handleVote(-1)}
              disabled={votingLoading}
              className={`flex-1 ${
                userVote === -1
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
              }`}
            >
              <X className="h-4 w-4 mr-2" />
              Won't go ({getVoteCount(-1)})
            </Button>
            {votingLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
