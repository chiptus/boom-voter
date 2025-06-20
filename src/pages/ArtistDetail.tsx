
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Music, Star, Heart, X, Play } from "lucide-react";
import { ArtistImageLoader } from "@/components/ArtistImageLoader";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number }[];
};

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchArtist();
      getUser();
    }
  }, [id]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user && id) {
      fetchUserVote(user.id);
    }
  };

  const fetchArtist = async () => {
    console.log('Fetching artist with id:', id);
    const { data, error } = await supabase
      .from("artists")
      .select(`
        *,
        music_genres (name),
        votes (vote_type)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error('Error fetching artist:', error);
      toast({
        title: "Error",
        description: "Failed to fetch artist details",
        variant: "destructive",
      });
    } else {
      console.log('Fetched artist:', data);
      setArtist(data);
    }
    setLoading(false);
  };

  const fetchUserVote = async (userId: string) => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from("votes")
      .select("vote_type")
      .eq("user_id", userId)
      .eq("artist_id", id)
      .single();

    if (!error && data) {
      setUserVote(data.vote_type);
    }
  };

  const handleVote = async (voteType: number) => {
    if (!user || !id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return;
    }

    if (userVote === voteType) {
      // Remove vote if clicking the same vote type
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("user_id", user.id)
        .eq("artist_id", id);

      if (!error) {
        setUserVote(null);
        fetchArtist(); // Refresh vote counts
      }
    } else {
      // Add or update vote
      const { error } = await supabase
        .from("votes")
        .upsert({
          user_id: user.id,
          artist_id: id,
          vote_type: voteType,
        });

      if (!error) {
        setUserVote(voteType);
        fetchArtist(); // Refresh vote counts
      }
    }
  };

  const getVoteCount = (voteType: number) => {
    if (!artist) return 0;
    return artist.votes.filter(vote => vote.vote_type === voteType).length;
  };

  const netVoteScore = artist ? getVoteCount(1) - getVoteCount(-1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Artist not found</h2>
          <Link to="/">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Artists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Artists
            </Button>
          </Link>
        </div>

        {/* Artist Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Artist Image */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
              <CardContent className="p-6">
                <ArtistImageLoader 
                  src={artist.image_url}
                  alt={artist.name}
                  className="w-full aspect-square rounded-lg shadow-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Artist Info */}
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
                    </div>
                  </div>
                </div>
                {artist.description && (
                  <CardDescription className="text-purple-200 text-lg leading-relaxed">
                    {artist.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {/* Updated 3-Level Voting System */}
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant={userVote === 2 ? "default" : "outline"}
                    onClick={() => handleVote(2)}
                    className={userVote === 2 ? "bg-orange-600 hover:bg-orange-700" : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Must go ({getVoteCount(2)})
                  </Button>
                  <Button
                    variant={userVote === 1 ? "default" : "outline"}
                    onClick={() => handleVote(1)}
                    className={userVote === 1 ? "bg-blue-600 hover:bg-blue-700" : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Interested ({getVoteCount(1)})
                  </Button>
                  <Button
                    variant={userVote === -1 ? "default" : "outline"}
                    onClick={() => handleVote(-1)}
                    className={userVote === -1 ? "bg-gray-600 hover:bg-gray-700" : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Won't go ({getVoteCount(-1)})
                  </Button>
                </div>

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
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
