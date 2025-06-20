
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Music, ThumbsUp, ThumbsDown, Play } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number }[];
};

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  external_urls: { spotify: string };
  genres: string[];
  followers: { total: number };
}

interface SoundCloudTrack {
  id: number;
  title: string;
  permalink_url: string;
  artwork_url: string;
  user: {
    username: string;
    permalink_url: string;
  };
}

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [spotifyData, setSpotifyData] = useState<SpotifyArtist | null>(null);
  const [soundcloudData, setSoundcloudData] = useState<SoundCloudTrack[]>([]);
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

  useEffect(() => {
    if (artist) {
      fetchSpotifyData();
      fetchSoundCloudData();
    }
  }, [artist]);

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

  const fetchSpotifyData = async () => {
    if (!artist) return;
    
    try {
      // This is a mock implementation - you'll need to implement actual Spotify API integration
      console.log('Would fetch Spotify data for:', artist.name);
      // Mock data for demonstration
      setSpotifyData({
        id: 'mock_id',
        name: artist.name,
        images: [{ url: '/placeholder.svg', height: 640, width: 640 }],
        external_urls: { spotify: `https://open.spotify.com/search/${encodeURIComponent(artist.name)}` },
        genres: [artist.music_genres?.name || 'Electronic'],
        followers: { total: Math.floor(Math.random() * 100000) }
      });
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
    }
  };

  const fetchSoundCloudData = async () => {
    if (!artist) return;
    
    try {
      // This is a mock implementation - you'll need to implement actual SoundCloud API integration
      console.log('Would fetch SoundCloud data for:', artist.name);
      // Mock data for demonstration
      setSoundcloudData([
        {
          id: 1,
          title: `${artist.name} - Latest Track`,
          permalink_url: `https://soundcloud.com/search?q=${encodeURIComponent(artist.name)}`,
          artwork_url: '/placeholder.svg',
          user: {
            username: artist.name,
            permalink_url: `https://soundcloud.com/search?q=${encodeURIComponent(artist.name)}`
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching SoundCloud data:', error);
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
                <img 
                  src={spotifyData?.images[0]?.url || '/placeholder.svg'} 
                  alt={artist.name}
                  className="w-full rounded-lg shadow-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Artist Info */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 h-full">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">{artist.name}</CardTitle>
                {artist.description && (
                  <CardDescription className="text-purple-200 text-lg">
                    {artist.description}
                  </CardDescription>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {artist.music_genres && (
                    <Badge variant="secondary" className="bg-purple-600/50 text-purple-100">
                      {artist.music_genres.name}
                    </Badge>
                  )}
                  {spotifyData?.followers && (
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      {spotifyData.followers.total.toLocaleString()} followers
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Voting */}
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant={userVote === 1 ? "default" : "outline"}
                    onClick={() => handleVote(1)}
                    className={userVote === 1 ? "bg-green-600 hover:bg-green-700" : "border-green-400 text-green-400 hover:bg-green-400 hover:text-white"}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {getVoteCount(1)}
                  </Button>
                  <Button
                    variant={userVote === -1 ? "default" : "outline"}
                    onClick={() => handleVote(-1)}
                    className={userVote === -1 ? "bg-red-600 hover:bg-red-700" : "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {getVoteCount(-1)}
                  </Button>
                </div>

                {/* External Links */}
                <div className="flex flex-wrap gap-4">
                  {spotifyData && (
                    <Button 
                      asChild 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <a href={spotifyData.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-2" />
                        Open in Spotify
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  {soundcloudData.length > 0 && (
                    <Button 
                      asChild 
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <a href={soundcloudData[0].permalink_url} target="_blank" rel="noopener noreferrer">
                        <Music className="h-4 w-4 mr-2" />
                        Open in SoundCloud
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Content */}
        {soundcloudData.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-white">Latest Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {soundcloudData.map((track) => (
                  <Card key={track.id} className="bg-white/5 border-purple-400/20 hover:bg-white/10 transition-all">
                    <CardContent className="p-4">
                      <h4 className="text-white font-semibold mb-2">{track.title}</h4>
                      <Button 
                        asChild 
                        size="sm" 
                        variant="outline" 
                        className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white w-full"
                      >
                        <a href={track.permalink_url} target="_blank" rel="noopener noreferrer">
                          Listen on SoundCloud
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
