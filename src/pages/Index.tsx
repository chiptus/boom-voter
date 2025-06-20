
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Music, Plus, ThumbsUp, ThumbsDown, LogIn, LogOut, UserPlus } from "lucide-react";
import { AuthDialog } from "@/components/AuthDialog";
import { AddArtistDialog } from "@/components/AddArtistDialog";
import { AddGenreDialog } from "@/components/AddGenreDialog";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number }[];
};

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAddArtist, setShowAddArtist] = useState(false);
  const [showAddGenre, setShowAddGenre] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getUser();
    fetchArtists();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserVotes(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      fetchUserVotes(user.id);
    }
    setLoading(false);
  };

  const fetchArtists = async () => {
    const { data, error } = await supabase
      .from("artists")
      .select(`
        *,
        music_genres (name),
        votes (vote_type)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch artists",
        variant: "destructive",
      });
    } else {
      setArtists(data || []);
    }
  };

  const fetchUserVotes = async (userId: string) => {
    const { data, error } = await supabase
      .from("votes")
      .select("artist_id, vote_type")
      .eq("user_id", userId);

    if (!error && data) {
      const votesMap = data.reduce((acc, vote) => {
        acc[vote.artist_id] = vote.vote_type;
        return acc;
      }, {} as Record<string, number>);
      setUserVotes(votesMap);
    }
  };

  const handleVote = async (artistId: string, voteType: number) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    const existingVote = userVotes[artistId];
    
    if (existingVote === voteType) {
      // Remove vote if clicking the same vote type
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("user_id", user.id)
        .eq("artist_id", artistId);

      if (!error) {
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[artistId];
          return newVotes;
        });
        fetchArtists();
      }
    } else {
      // Add or update vote
      const { error } = await supabase
        .from("votes")
        .upsert({
          user_id: user.id,
          artist_id: artistId,
          vote_type: voteType,
        });

      if (!error) {
        setUserVotes(prev => ({ ...prev, [artistId]: voteType }));
        fetchArtists();
      }
    }
  };

  const getVoteCount = (artist: Artist, voteType: number) => {
    return artist.votes.filter(vote => vote.vote_type === voteType).length;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserVotes({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Boom Festival</h1>
            <Heart className="h-8 w-8 text-pink-400" />
          </div>
          <p className="text-xl text-purple-200">Vote for your favorite artists!</p>
        </div>

        {/* Auth & Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {user ? (
            <>
              <Button onClick={() => setShowAddArtist(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Artist
              </Button>
              <Button onClick={() => setShowAddGenre(true)} variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Genre
              </Button>
              <Button onClick={signOut} variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowAuthDialog(true)} className="bg-purple-600 hover:bg-purple-700">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In / Sign Up
            </Button>
          )}
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Card key={artist.id} className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/20 transition-all">
              <CardHeader>
                <CardTitle className="text-white">{artist.name}</CardTitle>
                <CardDescription className="text-purple-200">
                  {artist.description}
                </CardDescription>
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
                    variant={userVotes[artist.id] === 1 ? "default" : "outline"}
                    onClick={() => handleVote(artist.id, 1)}
                    className={userVotes[artist.id] === 1 ? "bg-green-600 hover:bg-green-700" : "border-green-400 text-green-400 hover:bg-green-400 hover:text-white"}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {getVoteCount(artist, 1)}
                  </Button>
                  <Button
                    size="sm"
                    variant={userVotes[artist.id] === -1 ? "default" : "outline"}
                    onClick={() => handleVote(artist.id, -1)}
                    className={userVotes[artist.id] === -1 ? "bg-red-600 hover:bg-red-700" : "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {getVoteCount(artist, -1)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {artists.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No artists yet!</h3>
            <p className="text-purple-200">Be the first to add an artist to vote on.</p>
          </div>
        )}
      </div>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => {
          setShowAuthDialog(false);
          fetchArtists();
        }}
      />
      
      <AddArtistDialog 
        open={showAddArtist} 
        onOpenChange={setShowAddArtist}
        onSuccess={() => {
          setShowAddArtist(false);
          fetchArtists();
        }}
      />
      
      <AddGenreDialog 
        open={showAddGenre} 
        onOpenChange={setShowAddGenre}
      />
    </div>
  );
};

export default Index;
