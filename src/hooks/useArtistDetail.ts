import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number }[];
};

export const useArtistDetail = (id: string | undefined) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const { toast } = useToast();
  const { canEditArtists } = useGroups();

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
      checkPermissions();
    }
  };

  const checkPermissions = async () => {
    const editPermission = await canEditArtists();
    setCanEdit(editPermission);
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

  return {
    artist,
    user,
    userVote,
    loading,
    canEdit,
    handleVote,
    getVoteCount,
    netVoteScore,
    fetchArtist,
  };
};