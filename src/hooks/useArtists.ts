
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";
import type { FilterSortState } from "./useUrlState";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number }[];
};

export const useArtists = (filterSortState?: FilterSortState) => {
  const [user, setUser] = useState<any>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [userKnowledge, setUserKnowledge] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    getUser();
    fetchArtists();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserVotes(session.user.id);
        fetchUserKnowledge(session.user.id);
      }
    });

    // Listen for real-time updates to artists, votes, and knowledge
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artist_knowledge' }, () => {
        if (user) {
          fetchUserKnowledge(user.id);
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
      fetchUserKnowledge(user.id);
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

  const fetchUserKnowledge = async (userId: string) => {
    const { data, error } = await supabase
      .from("artist_knowledge")
      .select("artist_id")
      .eq("user_id", userId);

    if (!error && data) {
      const knowledgeMap = data.reduce((acc, knowledge) => {
        acc[knowledge.artist_id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setUserKnowledge(knowledgeMap);
    }
  };

  const handleVote = async (artistId: string, voteType: number) => {
    if (!user) {
      return { requiresAuth: true };
    }

    if (votingLoading[artistId]) {
      return { requiresAuth: false };
    }

    setVotingLoading(prev => ({ ...prev, [artistId]: true }));

    try {
      const existingVote = userVotes[artistId];
      
      if (existingVote === voteType) {
        // Remove vote if clicking the same vote type
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("artist_id", artistId);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to remove vote. Please try again.",
            variant: "destructive",
          });
        } else {
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
          }, {
            onConflict: 'user_id,artist_id'
          });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to save vote. Please try again.",
            variant: "destructive",
          });
        } else {
          setUserVotes(prev => ({ ...prev, [artistId]: voteType }));
          fetchArtists();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVotingLoading(prev => ({ ...prev, [artistId]: false }));
    }

    return { requiresAuth: false };
  };

  const handleKnowledgeToggle = async (artistId: string) => {
    if (!user) {
      return { requiresAuth: true };
    }

    const isKnown = userKnowledge[artistId];
    
    if (isKnown) {
      // Remove knowledge entry
      const { error } = await supabase
        .from("artist_knowledge")
        .delete()
        .eq("user_id", user.id)
        .eq("artist_id", artistId);

      if (!error) {
        setUserKnowledge(prev => {
          const newKnowledge = { ...prev };
          delete newKnowledge[artistId];
          return newKnowledge;
        });
      }
    } else {
      // Add knowledge entry
      const { error } = await supabase
        .from("artist_knowledge")
        .insert({
          user_id: user.id,
          artist_id: artistId,
        });

      if (!error) {
        setUserKnowledge(prev => ({ ...prev, [artistId]: true }));
      }
    }

    return { requiresAuth: false };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserVotes({});
    setUserKnowledge({});
  };

  // Calculate rating for an artist based on new vote weights
  const calculateRating = (artist: Artist): number => {
    if (artist.votes.length === 0) return 0;
    
    const totalScore = artist.votes.reduce((sum, vote) => {
      // Use the actual vote type values: 2 (Must go), 1 (Interested), -1 (Won't go)
      return sum + vote.vote_type;
    }, 0);
    
    return totalScore / artist.votes.length;
  };

  // Get positive vote count for popularity (only count vote_type >= 1)
  const getPositiveVoteCount = (artist: Artist): number => {
    return artist.votes.filter(vote => vote.vote_type >= 1).length;
  };

  // Filter and sort artists based on current state
  const filteredAndSortedArtists = useMemo(() => {
    if (!filterSortState) return artists;

    let filtered = artists.filter(artist => {
      // Stage filter
      if (filterSortState.stages.length > 0 && artist.stage) {
        if (!filterSortState.stages.includes(artist.stage)) return false;
      }

      // Genre filter
      if (filterSortState.genres.length > 0 && artist.music_genres) {
        if (!filterSortState.genres.includes(artist.genre_id)) return false;
      }

      // Rating filter
      if (filterSortState.minRating > 0) {
        const rating = calculateRating(artist);
        if (rating < filterSortState.minRating) return false;
      }

      return true;
    });

    // Sort artists
    filtered.sort((a, b) => {
      switch (filterSortState.sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating-desc':
          return calculateRating(b) - calculateRating(a);
        case 'popularity-desc':
          return getPositiveVoteCount(b) - getPositiveVoteCount(a);
        case 'date-asc':
          if (!a.estimated_date && !b.estimated_date) return 0;
          if (!a.estimated_date) return 1;
          if (!b.estimated_date) return -1;
          return new Date(a.estimated_date).getTime() - new Date(b.estimated_date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [artists, filterSortState]);

  return {
    user,
    artists: filteredAndSortedArtists,
    allArtists: artists,
    userVotes,
    userKnowledge,
    loading,
    votingLoading,
    handleVote,
    handleKnowledgeToggle,
    signOut,
    fetchArtists,
  };
};

export type { Artist };
