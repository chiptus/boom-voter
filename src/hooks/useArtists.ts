
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number }[];
};

export const useArtists = () => {
  const [user, setUser] = useState<any>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
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

    // Listen for real-time updates to artists and votes
    const artistsChannel = supabase
      .channel('artists-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, () => {
        fetchArtists();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        fetchArtists();
        if (user) {
          fetchUserVotes(user.id);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      artistsChannel.unsubscribe();
    };
  }, [user]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      fetchUserVotes(user.id);
    }
    setLoading(false);
  };

  const fetchArtists = async () => {
    console.log('Fetching artists...');
    const { data, error } = await supabase
      .from("artists")
      .select(`
        *,
        music_genres (name),
        votes (vote_type)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching artists:', error);
      toast({
        title: "Error",
        description: "Failed to fetch artists",
        variant: "destructive",
      });
    } else {
      console.log('Fetched artists:', data?.length || 0);
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
      return { requiresAuth: true };
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

    return { requiresAuth: false };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserVotes({});
  };

  return {
    user,
    artists,
    userVotes,
    loading,
    handleVote,
    signOut,
    fetchArtists,
  };
};

export type { Artist };
